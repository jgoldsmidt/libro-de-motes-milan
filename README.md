# MITH301 / MITH 628C Project Template

## Installation

Make sure you have NodeJS installed.

With the project folder open in VS Code, access the terminal and type:

```js
npm install
```

This will take a few minutes.

## Development

To work on your site, run Gastby so that it will show changes as you make them.

With the project folder open in VS Code, access the terminal and type:

```js
npm start
```

Then visit http://localhost:8080 in your browser.

## Deployment

To publish the website, commit and push changes to GitHub. This will trigger the build process on GitHub, which you can monitor form the repository page. If the build is successful, your project will be published at:

https://TECH_LEAD_USERNAME.github.io/PROJECT_NAME

## Troubleshooting

If the site is behaving unexpectedly, you can try to stop and restart Gastby. You can do this by accessing the terminal with Gatsby running and hitting Ctrl+C to stop Gatsby. Then start again (see Development above).

If you're still encountering issues, you can try and clean existing pre-generated data with the following command from the terminal:

```js
npm run clean
```

## Local build (optional)

To have a look at how the built static site looks like you can also build the website locally. Note that this will not affect the site on GitHub.

With the project folder open in VS Code, access the terminal and type:

```js
npm run build
```
