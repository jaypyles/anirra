from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

from saas_backend.auth.database import get_db
from saas_backend.auth.models import Anime


async def get_recommendations(anime_ids: list[int] = []):
    connection = next(get_db())

    # Get all anime for building the TF-IDF matrix
    all_anime = connection.query(Anime).all()

    # Create document corpus from anime tags and metadata
    corpus = []
    for anime in all_anime:
        corpus.append(anime.reccomendation_string)

    # Create TF-IDF vectors
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(corpus)

    # Get the input anime vectors
    input_anime_indices = []
    for anime_id in anime_ids:
        for idx, anime in enumerate(all_anime):
            if anime.id == anime_id:
                input_anime_indices.append(idx)
                break

    if not input_anime_indices:
        return []

    # Calculate mean vector of input anime
    input_vectors = tfidf_matrix[input_anime_indices]  # type: ignore
    mean_vector = np.asarray(input_vectors.mean(axis=0)).reshape(1, -1)  # type: ignore

    # Calculate cosine similarity between mean vector and all anime
    similarities = cosine_similarity(mean_vector, tfidf_matrix)[0]

    # Get top 5 most similar anime (excluding input anime)
    top_indices = np.argsort(similarities)[::-1]
    recommended_indices = [i for i in top_indices if i not in input_anime_indices][:10]

    recommendations = [all_anime[i] for i in recommended_indices]
    return recommendations
