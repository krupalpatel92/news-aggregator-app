<template>
  <div class="news-card" :class="type">
    <div class="card-image">
      <img
        :src="article.imgUrl || '/placeholder.png'"
        :alt="article.name || 'Placeholder image'"
      />
    </div>
    <div class="card-content">
      <a :href="article.URL || ''" target="_blank" class="card-content-link">
        <div class="meta">
          <router-link
            v-if="article.category"
            :to="'/category/' + article.category.slug"
            class="category"
            @click.stop
          >
            {{ article.category.name }}
          </router-link>
          <span class="date">{{ formatDate(article.publishedAt) }}</span>
        </div>
        <h2 class="title">{{ article.name }}</h2>
        <p v-if="type !== 'small'" class="summary">{{ article.summary }}</p>
        <div class="footer">
          <div class="source" v-if="article.source">
            By
            <router-link :to="'/source/' + article.source.slug" @click.stop>{{
              article.source.name
            }}</router-link>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

interface Article {
  imgUrl?: string;
  name: string;
  summary?: string;
  publishedAt: string;
  category?: {
    name: string;
    slug: string;
  };
  author?: {
    name: string;
    slug: string;
  };
  source?: {
    name: string;
    slug: string;
  };
  URL?: string;
}

export default defineComponent({
  name: "NewsCard",
  props: {
    article: {
      type: Object as PropType<Article>,
      required: true,
    },
    type: {
      type: String as PropType<"extra-large" | "large" | "medium" | "small">,
      default: "medium",
    },
  },
  methods: {
    formatDate(date: string) {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
});
</script>

<style scoped lang="scss">
@import './NewsCard.scss';
</style>
