# Secfi test assignment

[Live Demo](https://secfi-task.vercel.app/)

<p align="center">
  <img width="612" alt="Preview" src="https://user-images.githubusercontent.com/5172360/155219703-d123332c-bfbd-43f4-af1a-e38c4b5a83da.gif">
</p>

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Installation

- Install [Node.js](https://nodejs.org/en/download/);
- Install the dependencies:
    ```bash
    npm install
    ```
- Copy the `./.env.template` file to `./.env.local`, put your [Alphavantage](https://www.alphavantage.co/) API key to the `NEXT_PUBLIC_API_KEY` variable;
- Run the development server:
    ```bash
    npm run dev
    ```

## Task Description
The idea is to create an interactive web application that allows users to display exchange rates over time, using [https://www.alphavantage.co/](https://www.alphavantage.co/). The assignment doesn't have a hard time limit but we also don't want to take too much of your time, so try to spend a maximum of 4/5 hours on it.
Inputs of the app should be a base currency, a target currency, and an amount for the base currency. As a result, it should display the input amount converted from base to target currency (using the Alpha Vantage CURRENCY_EXCHANGE_RATE function), and a graph showing the historical rates for the past 30 days (using the Alpha Vantage FX_DAILY function).

## Task Requirements
Try to implement these features keeping the following requirements in mind:

- It should be built using TypeScript and React. If you have reasons to use another stack, let's discuss
- It should have a good looking, easy to understand interface. Show off some of your amazing skills
- It should minimize the number of API requests to make the app as efficient as possible
- It should be built with flexibility in mind, for example being able to switch data provider easily
