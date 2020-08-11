# Banking Simulation

This application allows the user to simulate creating a bank account. I wanted to create an application that could be used in the real world, as well as something that seems beneficial to future employers.

### Links

-   [Server Side Repo](https://github.com/kkorrapaty/bank-sim-server)
-   [Deployed API](https://bank-sim-server.herokuapp.com)
-   [Deployed Site](https://kkorrapaty.github.io/bank-sim-client/#/)

## Planning

After the backend was created, I decided to use React to continue learning how this library works. After a user signs in, they can create a Savings account and add a balance into it. There is a minimum limit of $50 that must be in the account, so there are no worries of overdrafts occurring.

#### User Stories

-   As an unregistered user I want to sign up/in
-   As a registered user I want to create accounts
    -   Checking
    -   Savings
-   As a registered user I want to
    -   Transfer between accounts
    -   Deposit/withdraw from account
    -   See how much is in account
    -   See previous transactions
    -   Input a Salary
    -   Account gets incremented automatically

#### Technologies Used

-   Javascript
-   React
-   HTML/CSS
-   Bootsrap

#### Catalog of Routes

| Verb   | URI Pattern  |
| ------ | ------------ |
| GET    | /savings     |
| GET    | /savings/:id |
| POST   | /savings     |
| PATCH  | /savings/:id |
| DELETE | /savings/:id |

#### Future Additions

In the future versions of this application I would like to add the ability for users to create multiple checkout accounts. As well as that, I want to invoke a functionality that allows those various accounts to transfer funds between each other

### Images

App Screenshot:

![](https://user-images.githubusercontent.com/45579271/89907356-921d1180-dbba-11ea-8e9e-c46ff43f3919.png)

****

WireFrame:

![WireFrame](https://media.git.generalassemb.ly/user/28548/files/a799e080-d834-11ea-9a0d-e8cb9431de40)
