<template>
  <div>
    <h1>Wiki Country</h1>
    <input
      v-model="query"
      @input="searchCountries"
      placeholder="Rechercher un pays..."
    />
    <ul>
      <li v-for="country in filteredCountries" :key="country.name.common">
        <router-link :to="`/country/${country.name.common}`">
          {{ country.name.common }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      query: "",
      countries: [],
      filteredCountries: [],
    };
  },
  methods: {
    async fetchCountries() {
      const response = await axios.get("https://restcountries.com/v3.1/all");
      this.countries = response.data;
    },
    searchCountries() {
      this.filteredCountries = this.countries.filter((country) =>
        country.name.common
          .toLowerCase()
          .includes(this.query.toLowerCase())
      );
    },
  },
  mounted() {
    this.fetchCountries();
  },
};
</script>

