<script setup lang="ts">
// Можно продожить рефакторинг, вынести панель управления в отдельный компонент и эмитеть оттуда события, а в этом компоненте реагировать на них,
// добавить обертку над тостами, с которой будет гораздо удобнее работать, да много чего еще можно сделать, но кому это надо?
// Думаю, даже этот текст и этот код никто никогда смотреть не будет.
import { useFetch, getEpisodeIdFromURL, getEpisodes, createUrl } from '@/lib/';
import { Character, ICard, Info } from '@/interfaces';

import Card from './components/Card.vue';

import Button from 'primevue/button';
import Paginator, { PageState } from 'primevue/paginator';
import SelectButton from 'primevue/selectbutton';
import InputText from 'primevue/inputtext';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import FloatLabel from 'primevue/floatlabel';

import {
  API_URL_CHARACTER,
  RECORD_PER_PAGE,
  statusFilterValues,
} from '@/const';
import { ref } from 'vue';
import { onMounted } from 'vue';

const toast = useToast();

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
    const e = <Error>error;

    cards.value = [];
    totalRecords.value = 0;

    toast.add({
      severity: 'error',
      summary: 'Fetch Error!',
      detail: e.message,
      life: 4000,
    });
  }
};

onMounted(() => {
  fetchCards({
    page: firstRecord.value + 1,
    filter: {
      status: statusFilterValue.value,
      name: nameFilterValue.value,
    },
  });
});

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
    page: firstRecord.value + 1,
    filter: {
      status: statusFilterValue.value,
      name: nameFilterValue.value,
    },
  });
};
</script>

<template class="app">
  <div class="control_panel mt-2">
    <SelectButton
      v-model="statusFilterValue"
      :options="statusFilterValues"
      optionLabel="option"
      optionValue="value"
      dataKey="value"
      aria-labelledby="custom"
    />
    <FloatLabel>
      <InputText id="heroname" v-model="nameFilterValue" />
      <label for="heroname">Имя героя</label>
    </FloatLabel>
    <!-- <InputText type="text" v-model="nameFilterValue" /> -->
    <Button label="Применить" @click="onSubmit" />
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
  <Toast />
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
