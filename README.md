# BLOOD-BRIDGE

## About the project
The database related files( ERD , Schema ) are included in the folder z_related_stuffs_to_the_project

### YouTube demonstration
https://youtu.be/XnIl-e37Hyg

## Getting Started

Follow the step by step installation procedure to install and run this on your machine

### Prerequisites

Make sure you have node and oracle installed in your device.

**`NodeJs`** : Install Node.js from [here](https://nodejs.org/en/download/)

**`Oracle`** : Install Oracle 19c from [here](http://www.oracle.com/index.html) and register for an account of your own

### Installation

#### Getting the repository

1. If Git is not installed on your device, you can download it from the official Git website: `[Download Git](https://git-scm.com/downloads)`
   or Download the zip file of the repo.

2. Go to command prompt/terminal and clone the repo

    ```sh
    git clone https://github.com/ShaidurPranto/Blood_Bridge.git
    ```

3. After installation or download go to the repository and open command prompt.
   Or go to the file location through command prompt

    ```sh
    cd <your-git-path>
    ```

4. Install NPM packages

    ```sh
    npm install
    ```

#### Setting up the database

1. Go to command prompt/terminal and type sqlplus

    ```sh
    sqlplus
    ```

2. Enter credentials

    ```sh
    username: sys as sysdba
    password: <your-database-password>
    ```

3. Create a new user c##BB

    ```
    create user c##BB identified by password;
    grant dba to c##BB;
    ```

4. Find file sql-dump.sql in database_structures folder

5. Open a database GUI and connect BB with that. If you don't have any GUI applicaton then you can just dump the whole files content in SQL Plus

6. Import data from sql file depending upon the GUI and run the sql.

## ScreenShots 
![Screenshot 2024-07-26 153616](https://github.com/user-attachments/assets/882627f5-c820-4065-a494-0bc80d37993a)

![Screenshot 2024-07-26 153711](https://github.com/user-attachments/assets/46449458-885e-4ad9-b1c2-91dabece14df)

![Screenshot 2024-07-26 153818](https://github.com/user-attachments/assets/33277dad-6d28-46e6-945e-ee355e844042)

![Screenshot 2024-07-26 153849](https://github.com/user-attachments/assets/e734ed11-eaca-4dd5-a377-aec8d758cddd)

![Screenshot 2024-07-26 154022](https://github.com/user-attachments/assets/4efeccd3-cb75-452d-bc17-cdc677262a67)
