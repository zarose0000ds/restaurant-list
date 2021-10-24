# Restaurant List

For ALPHA Camp Web App exercise: implement a simple website server with Express.js.

Website theme: restaurant review site.

## Seed Data
Use the following script to generate seed data of user and restaurant.
```bash
npm run seed
```

## Register and Login
1. Users can use email to register a new account.
2. Server-side validation for registration form.
3. Users need to login to use the website service.
4. Users can use Facebook account to login.

## Main List
1. Users can browse their own restaurant cards showing basic information.
2. Users can click the card for more detail.
3. Users can search specific restaurants with keywords of name or category.
4. Users can add a new restaurant via the button above list.
5. Users can edit or delete the restaurant via buttons on the card.

## Search
1. The keywords can be multiple.
2. The search page will show a text tip when there is no matched result.
3. The website will redirect to the home page when the keywords are empty.

## Add New and Edit
1. Server-side validation for restaurant form.
2. Users can upload the restaurant image.
3. The image will be stored in the DB, being removed when the restaurant is deleted.
4. The old image will be removed when users update a new one.
5. Users can add Google Map share link of the restaurant.
6. Users can give their own restaurant rating with the slider.