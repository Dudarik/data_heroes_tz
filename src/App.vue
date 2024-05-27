<script setup lang="ts">
import { useFetch, getEpisodeIdFromURL, getEpisodes, createUrl } from '@/lib/';
import { Character, ICard, Info } from '@/interfaces';

import Card from './components/Card.vue';

import Button from 'primevue/button';
import Paginator, { PageState } from 'primevue/paginator';
import SelectButton from 'primevue/selectbutton';
import InputText from 'primevue/inputtext';

import {
  API_URL_CHARACTER,
  RECORD_PER_PAGE,
  statusFilterValues,
} from '@/const';
import { ref } from 'vue';

const totalRecords = ref(0);
const firstRecord = ref(0);

const statusFilterValue = ref(statusFilterValues[0].value);
const nameFilterValue = ref('');

const cards = ref<ICard[]>([]);

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

    let episodes: { [k: string]: string } = {};

    if (!Object.keys(episodes).length) episodes = await getEpisodes();

    const { info, results } = characters.value;

    if (info) {
      totalRecords.value = info.count;
    }

    if (results)
      cards.value = results.map((item) => {
        const { name, image, status, species } = item;
        return {
          name,
          image,
          status,
          species,
          location: item.location.name,
          episode: episodes[getEpisodeIdFromURL(item.episode[0]).toString()],
        };
      });
  } catch (error) {
    console.error(error);
  }
};

const onSelectPage = async (event: PageState) => {
  const { page } = event;

  fetchCards({
    page: page + 1,
    filter: {
      status: statusFilterValue.value,
      name: nameFilterValue.value,
    },
  });
};

const updateFirst = (event: number) => {
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
    :rows="RECORD_PER_PAGE"
    :totalRecords="totalRecords"
    @update:first="updateFirst"
    @page="onSelectPage"
    v-if="totalRecords > RECORD_PER_PAGE"
    class="mt-2"
  />
</template>

<style scoped lang="scss">
.control_panel {
  display: flex;
  justify-content: center;
  gap: 1rem;
}
.cards {
  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 2rem;

  gap: 1rem;
  flex-wrap: wrap;
}
.mt-2 {
  margin-top: 2rem;
}
</style>
