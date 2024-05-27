<script setup lang="ts">
import { useFetch } from '@/lib/';
import { Character, Episode, Info } from './interfaces';

import Card from './components/Card.vue';

import Button from 'primevue/button';
import Paginator, { PageState } from 'primevue/paginator';
import SelectButton from 'primevue/selectbutton';
import InputText from 'primevue/inputtext';

import { API_URL_CHARACTER, API_URL_EPISODE } from './const';
import { ref } from 'vue';

const totalRecords = ref(0);
const firstRecord = ref(0);
const statusFilterValues = [
  { option: 'All', value: undefined },
  { option: 'Alive', value: 'alive' },
  { option: 'Dead', value: 'dead' },
  { option: 'Unknown', value: 'unknown' },
];

const RECORD_PER_PAGE = 20;

const statusFilterValue = ref(statusFilterValues[0].value);
const nameFilterValue = ref('');

let episodes: { [k: string]: string } = {};
const cards = ref<
  {
    name: string;
    image: string;
    status: string;
    species: string;
    location: string;
    episode: string;
  }[]
>([]);

const getEpisodeIdFromURL = (url: string) => {
  const tArr = url.split('/');
  return tArr[tArr.length - 1];
};
const getEpisodes = async () => {
  let e_page = 1;
  const episodes = [];

  while (true) {
    const { data: episodes_p, error: error_l } = await useFetch<
      void,
      Info<Episode[]>
    >({ url: `${API_URL_EPISODE}?page=${e_page++}` });

    if (error_l.value) throw new Error(error_l.value.message);
    if (!episodes_p.value) throw new Error("Can't load episodes");

    const { results } = episodes_p.value;

    if (results) episodes.push(...results);

    if (!episodes_p.value.info?.next) break;
  }
  return Object.fromEntries(episodes.map((item) => [item.id, item.name]));
};

const createUrl = (
  url: URL,
  params?: {
    page?: number;
    filter?: { name?: string; status?: string };
  }
) => {
  if (!params) return url.toString();

  const { page, filter } = params;
  if (page) url.searchParams.set('page', page.toString());
  if (filter) {
    const { name, status } = filter;

    if (name) url.searchParams.set('name', name);
    if (status) url.searchParams.set('status', status);
  }
  return url.toString();
};

const fetchCards = async (params?: {
  page?: number;
  filter?: { name?: string; status?: string };
}) => {
  try {
    const url = createUrl(new URL(API_URL_CHARACTER), params);

    const { data: characters, error: error_c } = await useFetch<
      void,
      Info<Character[]>
    >({ url });

    if (error_c.value) throw new Error(error_c.value.message);

    if (!characters.value) throw new Error("Can't load characters");

    if (!Object.keys(episodes).length) episodes = await getEpisodes();

    const { info, results } = characters.value;

    if (info) {
      totalRecords.value = info.count;
    }

    if (results)
      cards.value = results.map((item) => ({
        name: item.name,
        image: item.image,
        status: item.status,
        species: item.species,
        location: item.location.name,
        episode: episodes[getEpisodeIdFromURL(item.episode[0]).toString()],
      }));

    console.log('characters', characters.value);
    console.log('cards', cards.value);
    console.log('episodes', episodes.value);
  } catch (error) {
    console.error(error);
  }
};

const onClickFetch = async () => {
  fetchCards({
    page: 2,
  });
};

const onSelectPage = async (event: PageState) => {
  console.log('onSelectPage', event);
  const { page } = event;

  // firstRecord.value = page;

  fetchCards({
    page: page + 1,
    filter: {
      status: statusFilterValue.value,
      name: nameFilterValue.value,
    },
  });
};

const upDateFirst = (event: number) => {
  firstRecord.value = event;
};

const onSubmit = async () => {
  firstRecord.value = 0;

  fetchCards({
    page: firstRecord.value,
    filter: {
      status: statusFilterValue.value,
      name: nameFilterValue.value,
    },
  });
};
</script>

<template class="app">
  <Button label="Fill" @click="onClickFetch" />
  <div class="control_panel">
    <SelectButton
      v-model="statusFilterValue"
      :options="statusFilterValues"
      optionLabel="option"
      optionValue="value"
      dataKey="value"
      aria-labelledby="custom"
    />
    <InputText type="text" v-model="nameFilterValue" />
    <Button label="Submit" @click="onSubmit" />
  </div>

  <div class="cards">
    <Card v-for="card in cards" v-bind="card" />
  </div>
  <Paginator
    :first="firstRecord"
    @update:first="upDateFirst"
    :rows="RECORD_PER_PAGE"
    :totalRecords="totalRecords"
    @page="onSelectPage"
    v-if="totalRecords > RECORD_PER_PAGE"
  />
</template>

<style scoped lang="scss">
.control_panel {
  display: flex;
  gap: 1rem;
}
.cards {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 1rem;
  flex-wrap: wrap;
}
</style>
