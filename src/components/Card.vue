<script setup lang="ts">
interface IProps {
  name: string;
  image: string;
  status: string;
  species: string;
  location: string;
  episode: string;
}

const props = defineProps<IProps>();
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

<style scoped lang="scss"></style>
