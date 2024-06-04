# Todo API's

// All the data transfers should be using encyption which will be encryption using RSA

// make the auth middleware to handle authorization based on roles, for example:- a transaction should be initiated from customer only, not the merchants, so you can create different auth middlewares to handle this functionality

during all verification proccess, check the fingerprint of the application mainly focus on the ip addresses where a user needs an otp verification

- create-account
- create an otp-creator function
- create an otp verification function
- login-account
- logout-api

- fill information [fill account detail ]
  example:- name, account number

- before transaction get's approved create an otp verification to know that the requester is that particular customer
- make transaction [make payment from customers bank account to merchants bank account], during that save the transaction
- during transaction, account creation make an api to send notification to their phone number and email
