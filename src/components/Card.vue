<script setup lang="ts">
import { ICard } from '@/interfaces';

const props = defineProps<ICard>();
</script>

<template>
  <div class="card">
    <div class="card_image">
      <img :alt="props.name" :src="props.image" />
    </div>
    <div class="card_content">
      <h2 class="card_title">{{ props.name }}</h2>
      <div class="card_subtitle">{{ props.status }} - {{ props.species }}</div>
      <p class="card_section">
        <span class="section_title">Last known location:</span>
        {{ props.location }}
      </p>
      <p class="card_section">
        <span class="section_title">First seen in:</span> {{ props.episode }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  color: rgb(245, 245, 245);

  display: flex;
  gap: 1rem;
  border-radius: 0.5rem;

  width: 40rem;
  height: 14rem;
  background: rgb(60, 62, 68);

  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
    rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;

  overflow: hidden;

  @media screen and (max-width: 700px) {
    width: 80%;
    height: 100%;

    flex-direction: column;
  }
  .card_image {
    display: flex;

    img {
      width: 100%;
    }
  }
  .card_title {
    margin: 0.5rem 0;
  }

  .card_content {
    display: flex;
    flex-direction: column;

    @media screen and (max-width: 700px) {
      padding: 0 1rem;
    }
    .card_section {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      .section_title {
        color: rgb(158, 158, 158);
      }
    }
  }
}
</style>
