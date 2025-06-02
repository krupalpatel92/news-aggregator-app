<template>
  <div class="news-card" :class="type">
    <div class="card-image" v-if="article.imgUrl">
      <img :src="article.imgUrl" :alt="article.name" />
    </div>
    <div class="card-content">
      <div class="meta">
        <router-link 
          v-if="article.category"
          :to="'/category/' + article.category.slug" 
          class="category"
        >
          {{ article.category.name }}
        </router-link>
        <span class="date">{{ formatDate(article.publishedAt) }}</span>
      </div>
      <h2 class="title">{{ article.name }}</h2>
      <p v-if="type !== 'small'" class="summary">{{ article.summary }}</p>
      <div class="footer">
        <div class="author" v-if="article.author">
          By <router-link :to="'/author/' + article.author.slug">{{ article.author.name }}</router-link>
        </div>
        <div class="source" v-if="article.source">
          From <router-link :to="'/source/' + article.source.slug">{{ article.source.name }}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

interface Article {
  imgUrl?: string
  name: string
  summary?: string
  publishedAt: string
  category?: {
    name: string
    slug: string
  }
  author?: {
    name: string
    slug: string
  }
  source?: {
    name: string
    slug: string
  }
}

export default defineComponent({
  name: 'NewsCard',
  props: {
    article: {
      type: Object as PropType<Article>,
      required: true
    },
    type: {
      type: String as PropType<'extra-large' | 'large' | 'medium' | 'small'>,
      default: 'medium'
    }
  },
  methods: {
    formatDate(date: string) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }
})
</script>

<style scoped>
.news-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-image {
  width: 100%;
  position: relative;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  overflow: hidden;
}

.card-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 1rem;
}

.meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.category {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.date {
  color: var(--secondary-color);
}

.title {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  font-weight: 600;
}

.summary {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: var(--secondary-color);
}

.footer a {
  color: var(--primary-color);
  text-decoration: none;
}

/* Card type variations */
.extra-large .card-image {
  padding-top: 50%;
}

.extra-large .title {
  font-size: 1.5rem;
}

.large .title {
  font-size: 1.25rem;
}

.small {
  display: flex;
  align-items: start;
}

.small .card-image {
  width: 100px;
  min-width: 100px;
  padding-top: 100px;
  margin-right: 1rem;
}

.small .card-content {
  padding: 0;
}

.small .title {
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.small .footer {
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .small {
    flex-direction: column;
  }

  .small .card-image {
    width: 100%;
    padding-top: 56.25%;
    margin-right: 0;
  }

  .small .card-content {
    padding: 1rem;
  }
}
</style> 