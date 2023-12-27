Prerequisites for Local
You must have Git installed. If you have Homebrew installed already, simply execute the following in the Terminal: brew install git. Otherwise, follow the official guide .
You must have NPM (Node Package Manager) installed. As above, you can use Homebrew: brew install node Otherwise, install it yourself.
Cloning the Repository
Unless you just want to run the tests on Jenkins, you'll need to clone the repository to your machine. Once you have Git installed (as mentioned above), in a terminal, navigate to where you prefer to keep your repos. E.g., cd ~/MY/REPOS/PATH (wherever you prefer to keep your Git repositories on your local machine).

Note: If perchance you end up using GitHub Desktop (a GUI for Git/GitHub interactions), you may want to create a sub-directory named GitHub. So, for example, you might create a directory stucture like this: ~/Documents/Repos/GitHub With that as our example, perform the following:

cd ~/Documents/Repos/GitHub

nstall Cypress: npm install cypress --save-dev

To verify things are working, execute the following:

npm run cypress -- --env configFile=rc1

