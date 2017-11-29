# Teller - your personal finance assistant

<img src="http://i.imgur.com/fuxlaFc.png" width="200">

Master:
![Build Status](https://travis-ci.org/SamKirkiles/Teller.svg?branch=master)
Development:
![Build Status](https://travis-ci.org/SamKirkiles/Teller.svg?branch=development)


A chatbot assistant for your personal finances.

## About

Teller is hosted on a fleet of AWS EC2 instances with autoscaling and load balancing to handle large spikes of trafic that are common with conversational interfaces.

The service has three components: 
  1. The messaging interface through Facebook Messenger
  2. The website frontend that handles account information
  3. The backend that handles routing, account analysis, and much more
  
Teller uses Plaid for account aggreation and Google's api.ai for nlp.

https://tellerchatbot.com

The service is fully functional but is currently in closed beta because of lack of funding.
  
## Gallery
<p align="center">
  <img src="https://i.imgur.com/fApimdo.jpg" width="600">
</p>

<p align="center">
  <img src="https://i.imgur.com/GCpMQmQ.jpg" width="600">
</p>

<p align="center">
  <img src="https://i.imgur.com/mOboEri.jpg" width="600">
</p>


