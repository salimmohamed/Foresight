import os
import requests
import argparse
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

load_dotenv()

ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
RECIPIENT_EMAIL = os.getenv("RECIPIENT_EMAIL")

def get_stock_data(symbol):
    """Fetches stock data from Alpha Vantage."""
    url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={ALPHA_VANTAGE_API_KEY}"
    response = requests.get(url)
    data = response.json()
    return data["Time Series (Daily)"]

def get_price_change(stock_data):
    """Calculates the percentage change in price between the last two days."""
    dates = list(stock_data.keys())
    latest_date = dates[0]
    previous_date = dates[1]
    latest_close = float(stock_data[latest_date]["4. close"])
    previous_close = float(stock_data[previous_date]["4. close"])
    return ((latest_close - previous_close) / previous_close) * 100

def get_news(company_name, num_articles):
    """Fetches news articles from NewsAPI."""
    url = f"https://newsapi.org/v2/everything?q={company_name}&apiKey={NEWS_API_KEY}"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for HTTP errors (4xx or 5xx)
        data = response.json()
        if data.get("articles"):
            return data["articles"][:num_articles]
        else:
            print(f"NewsAPI response did not contain articles: {data}")
            return []
    except requests.exceptions.RequestException as e:
        print(f"Error fetching news from NewsAPI: {e}")
        return []
    except ValueError:
        print(f"Error decoding JSON from NewsAPI response: {response.text}")
        return []

def send_email(subject, body):
    """Sends an email using SMTP."""
    msg = MIMEMultipart()
    msg['From'] = EMAIL_ADDRESS
    msg['To'] = RECIPIENT_EMAIL
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'plain'))

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            smtp.send_message(msg)
        print("Email sent successfully!")
    except Exception as e:
        print(f"Error sending email: {e}")
        print("Please check your EMAIL_ADDRESS, EMAIL_PASSWORD, and RECIPIENT_EMAIL in the .env file.")
        print("If using Gmail, ensure 'Less secure app access' is enabled or use an App Password.")

def main():
    """Main function to run the stock alert app."""
    parser = argparse.ArgumentParser(description="Stock News Alert CLI")
    parser.add_argument("--symbol", type=str, required=True, help="Stock symbol (e.g., AAPL)")
    parser.add_argument("--companyName", type=str, nargs='+', required=True, help="Company name (e.g., Apple Inc. or Apple)")
    parser.add_argument("--threshold", type=float, default=5.0, help="Price change threshold (in percent)")
    parser.add_argument("--numArticles", type=int, default=3, help="Number of news articles to fetch")
    args = parser.parse_args()

    try:
        stock_data = get_stock_data(args.symbol)
        price_change = get_price_change(stock_data)

        if abs(price_change) >= args.threshold:
            company_name = " ".join(args.companyName)
        if abs(price_change) >= args.threshold:
            news = get_news(company_name, args.numArticles)
            message = f"{args.symbol}: {price_change:.2f}% change.\n"
            for article in news:
                message += f"\nHeadline: {article['title']}\n"
            send_email(subject=f"{args.symbol} Stock Alert", body=message)
            print("Email alert sent.")
        else:
            print(f"{args.symbol}: {price_change:.2f}% change. No alert sent.")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()