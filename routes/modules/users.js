const express = require('express')
const passport = require('passport')
const bcrypt = require('bcrypt')
const router = express.Router()

const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true}), (req, res) => {
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
  const passwordReg = /^(?=.*\d)(?=.*[a-zA-Z]).{8,24}$/
  const errors = []

  if (!email || !password || !confirmPassword) {
    errors.push({ message: '有尚未填寫的必填欄位！。' })
  }
  if (email && !emailReg.test(email)) {
    errors.push({ message: '請填寫正確的電子郵件格式！' })
  }
  if (password && !passwordReg.test(password)) {
    errors.push({ message: '密碼不符合規定條件！' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }

  User.findOne({ email }).then(user => {
    if (user) {
      errors.push({ message: '這個 Email 已經註冊過了。' })
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }

    return bcrypt.genSalt(10).then(salt => bcrypt.hash(password, salt)).then(hash => User.create({
      name,
      email,
      password: hash
    })).then(user => {
      // USE EMAIL LOCAL-PART AS USER NAME IF NOT EXISTS
      if (user.name.length <= 0) {
        user.name = user.email.split('@')[0]
        user.save()
      }
    }).then(() => res.redirect('/')).catch(e => console.log(e))
  })
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})

module.exports = router