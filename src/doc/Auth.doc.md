## Todo

- take the data from the user
- Validate the data
- Create a user in the database
  - if the user try to login more than 5 times within 10 minutes, block the user for 40 minutes
  - after the block time is over, unblock the user
  - and send an email to the user to inform him about the block the email should contain the time , ip address , os and browser of the user
  - Update the logs file with the login attempts and the block time
