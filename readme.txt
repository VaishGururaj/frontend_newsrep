# NLP-Russia Project Readme

Overview
The NLP-Russia Project is a Flask-based web application that analyzes a large collection of Russian newspaper articles. The primary functionalities include querying for sentiment analysis, tracking the number of occurrences over time, identifying publication media, determining the number of articles, specifying regions, and listing the 20 most related articles.

Project Components
Flask Web Application: The project is implemented using Flask, allowing users to interact with the NLP analysis through an API. The front-end is built using React and Material-ui.

Libraries and Tools:

torch: PyTorch library for deep learning.
transformers: Hugging Face Transformers library for pre-trained language models.
sentence_transformers: Sentence Transformers library for sentence embeddings.
pandas: Pandas for data manipulation.
gensim: Gensim for topic modeling.
nltk: NLTK for natural language processing tasks.
translate: Translate library for language translation.
FastText: Gensim's FastText model for word embeddings.
flask: Flask web framework.
flask_cors: Flask CORS for cross-origin resource sharing.

Data Files:

Region_Code.csv: CSV file containing region codes and descriptors.
data_Emb_with_embeddings.pkl: Pickle file with DataFrame containing article embeddings.
taxonomy.csv: CSV file with taxonomy data.
cc.ru.300.bin: FastText model for Russian word embeddings.
full-data.csv: CSV file containing the full dataset of newspaper articles.

Installation
1. Clone the repository.
2. Install required packages. 
3. Download the FastText model 'cc.ru.300.bin' from [FastText pre-trained models] and save it in the backend directory.
4. Dowload the dataset "full-data.csv" from factiva data and save it in the backend directory.
5. Install packages using "npm install" for front-end dependencies. 

Usage
1. Run the Flask API: `python [app_filename].py`
2. Run the web application: `npm start`
3. Access the application through a web browser at `http://localhost:8000`.

API Endpoint
- `/get_dataframe` (POST): Endpoint for receiving JSON data and providing analysis results.

Functions
- `search(query, fromdt=None, todt=None)`: Function for querying tracking articles and listing related articles. The transformer models used can be experimented with and replaced with other models. The number of tokens for most sentence transformer models is 256 or 512. As the length of articles sometimes surpass 5000 tokens, the articles are divided into paragraphs ('\n\n') and then passed to the model so that maximum tokens of one large article are processed together.
- `final_function(word, threshold, start_date=None, end_date=None, location=None)`: Function for counting keywords, extracting relevant sentences and sentiment analysis.

Configuration
- The default region is set to "Russia" if not provided.
- Default dates are set to January 2020 to June 2020 if not provided.
- Keyword: The keyword can be either in English or Russian and is required. The more details provided in the query string, the better for article listings. 

Future Scope:
- Optimizing the sentence count to work faster as majority of the time consumption is happening at Stage 3 of sentence counts.
- Using date range pickers to work more efficiently and validating the data.
- Getting the article embeddings for the entire dataset as currently the article selection happens from january 2020 to june 2020.