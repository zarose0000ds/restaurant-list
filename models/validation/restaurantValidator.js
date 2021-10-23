module.exports = (formInput) => {
  const { name, name_en, category, location, phone, description } = formInput
  const nameEnReg = /^[a-zA-Z0-9\s]+$/
  const phoneReg = /^\d{2,3}\s\d{3,4}\s\d{4}$/
  const errors = []

  if (!name || !category || !location || !phone || !description) {
    errors.push({ message: '有尚未填寫的必填欄位！' })
  }
  if (name_en && !nameEnReg.test(name_en)) {
    errors.push({ message: '英文名稱限填大小寫英文及數字！' })
  }
  if (phone && !phoneReg.test(phone)) {
    errors.push({ message: '請按照規定格式填寫電話號碼！' })
  }

  return errors
}