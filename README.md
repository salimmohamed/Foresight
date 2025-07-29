# Foresight: From Daily Challenge to AI-Driven Trading Insights

This project began as a humble exercise on Day 36 of the "100 Days of Code: The Complete Python Pro Bootcamp" course. What started as a simple stock monitoring script quickly evolved into a captivating exploration of financial data, real-time alerts, and the immense potential of artificial intelligence in trading. My fascination with leveraging technology to gain an edge in financial markets has driven me to expand this foundational CLI application.

This repository represents the initial phase of building a sophisticated trading assistant. My vision extends beyond basic alerts; I aim to integrate advanced Large Language Models (LLMs) and other AI techniques to analyze market sentiment, predict trends, and ultimately, provide intelligent, actionable insights for trading decisions. The long-term goal is to develop a system capable of not just informing, but potentially automating, trading strategies based on robust AI analysis.

## Project Overview

This project is a Python-based command-line interface (CLI) application that monitors stock prices, fetches relevant news, and sends email alerts based on price fluctuations. It is part of the Foresight suite.

## Features & Technical Implementation

- **Stock Price Monitoring (Alpha Vantage API):** The application fetches daily closing prices for specified stock symbols using the Alpha Vantage API. This robust financial data API provides historical and real-time stock information, crucial for accurate price change calculations.

- **Price Change Calculation:** It computes the percentage change in the stock's closing price between the two most recent trading days. This core logic identifies significant market movements that warrant an alert.

- **News Integration (NewsAPI):** When a significant price change is detected, the application queries the NewsAPI to retrieve relevant news articles for the associated company. This provides context to the price movement, helping users understand the underlying reasons.

- **Email Alerts (SMTP & `smtplib`):** Instead of traditional SMS, alerts are dispatched via email using Python's built-in `smtplib` library. This allows for rich, detailed notifications directly to the user's inbox, leveraging standard email protocols (SMTP) for reliable delivery. For security, App Passwords are recommended for services like Gmail.

- **Command-Line Interface (`argparse`):** The application is designed as a CLI tool, making it easy to run and configure from the terminal. The `argparse` module is used to handle command-line arguments such as stock symbol, company name, price change threshold, and the number of news articles.

- **Environment Variable Management (`python-dotenv`):** API keys and sensitive credentials (like email passwords) are securely loaded from a `.env` file using `python-dotenv`. This practice ensures that sensitive information is not hardcoded into the application and is kept out of version control, enhancing security and maintainability.

- **Console Logging:** For movements that do not meet the alert threshold, the application provides clear console output, keeping the user informed without unnecessary notifications.

## Future Plans

This project is the foundation for a more advanced trading assistant. Future development will focus on:

- **AI-Powered Trading Insights:** Integrating advanced Large Language Models (LLMs) and other AI techniques to analyze market sentiment, predict trends, and provide intelligent, actionable trading recommendations. This will involve natural language processing of news, social media, and financial reports.
- **Automated Trading:** Building a secure and reliable system to automate trades based on the AI's insights and user-defined strategies. This phase will require careful consideration of risk management, execution platforms, and regulatory compliance.

## Getting Started

### Prerequisites

- Python 3.x
- `pip` (Python package installer)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/foresight.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd stock-news-alert
   ```
3. **Install the dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Set up your environment variables:**
   - Create a `.env` file in the root directory of the project.
   - Add your API keys and email credentials to the `.env` file. Replace the placeholder values with your actual keys and credentials:
     ```
     ALPHA_VANTAGE_API_KEY=YOUR_API_KEY
     NEWS_API_KEY=YOUR_API_KEY
     EMAIL_ADDRESS=YOUR_EMAIL_ADDRESS
     EMAIL_PASSWORD=YOUR_EMAIL_PASSWORD
     RECIPIENT_EMAIL=RECIPIENT_EMAIL_ADDRESS
     ```
   **Note for Gmail users:** If you are using Gmail, you **must** generate an "App Password" for `EMAIL_PASSWORD` as regular passwords often do not work for programmatic access. Refer to Google's documentation on how to set up an App Password. Ensure there are no spaces in the App Password when you paste it into the `.env` file.

### Usage

Run the application from the command line with the following arguments:

```bash
python main.py --symbol <STOCK_SYMBOL> --companyName <COMPANY_NAME> --threshold <PRICE_CHANGE_PERCENTAGE> --numArticles <NUMBER_OF_ARTICLES>
```

- `--symbol`: The stock ticker symbol (e.g., `TSLA`, `AAPL`).
- `--companyName`: The full company name (e.g., `Tesla`, `Apple Inc.`). Use quotes if the name contains spaces.
- `--threshold`: The percentage change in stock price (e.g., `3.0` for 3%) that triggers an alert. Defaults to `5.0`.
- `--numArticles`: The maximum number of news articles to fetch and include in the alert email. Defaults to `3`.

**Example:**

```bash
python main.py --symbol TSLA --companyName "Tesla" --threshold 3 --numArticles 5
```

This command will monitor Tesla (TSLA) and send an email alert with the top 5 news articles if the stock price changes by more than 3%.