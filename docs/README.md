# Mintlify Starter Kit

Click on `Use this template` to copy the Mintlify starter kit. The starter kit contains examples including

- Guide pages
- Navigation
- Customizations
- API Reference pages
- Use of popular components

### 👩‍💻 Development

Hello so you have iterated, worked effortlessly on Svelvet and now you will begin Documentation Updates to let everyone know of your changes.

GREAT!!
Firstly, Congratulations and Thank You for all your hard work.

Lets get started:
To update Svelvet's document on its website, the creator used Mintlify.
You should have a login and password provided to you in a Credentials Spreadsheet to gain access to all accounts Svelvet related. Upon login, there will be 2 Factor Authentication. You should also have access to Svelvet's Gmail which you may need to verify. If you're logged in on Svelvet's Gmail, your original gmail will be exited hence viewing your calendar will be lost. You can always login again.
Also you will need access to Svelvet's GitHub.

You will first need to install Mintlify, either globally as with the command below or locally.
Install the [Mintlify CLI](https://www.npmjs.com/package/mintlify) to preview the documentation changes locally. To install, use the following command

```
npm i -g mintlify
```

Run the following command at the root of your documentation (where mint.json is).
To get to the mint.json file, type ls into the command line of your branch.
Next, locate your mint.json file or docs file. If you try to run mintlify outside of any of these files, it will ask you to go to into any of these files.
You will need to cd into either file/ folder.
After you run the "npx mintlify dev", you will see a local host browser will automatically run showcasing the Svelvet website.

```
mintlify dev
```

GREAT job following along.
Next, lets visit the docs folder in your repo. You will see in the docs folder several files ending with the "mdx". These files are all the files associated with the webpage in the browser. Each file is editable. As you edit these mdx files, you will see live changes in the browser.
\*docs

- components
  -anchor.mdx
  -background.mdx
  -contrasttheme.mdx......
  -upgrading.mdx

Remember, as you make changes, remember to update all ReadMe's locally.

### 😎 Publishing Changes

Changes will be deployed to production automatically after pushing to the default branch. The URL should remain the same. The website however should change once pushed.

You can also preview changes using PRs, which generates a preview link of the docs.

#### Troubleshooting

- Mintlify dev isn't running - Run `mintlify install` it'll re-install dependencies.
- Page loads as a 404 - Make sure you are running in a folder with `mint.json`
