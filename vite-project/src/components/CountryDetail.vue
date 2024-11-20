<template>
  <div v-if="country">
    <h1>{{ country.name.common }}</h1>
    <p><strong>Nom officiel :</strong> {{ country.name.official }}</p>
    <p><strong>Capitale :</strong> {{ country.capital?.[0] || "N/A" }}</p>
    <p><strong>Population :</strong> {{ country.population.toLocaleString() }}</p>
    <p><strong>Langues :</strong> {{ languages }}</p>
    <p><strong>Superficie :</strong> {{ country.area.toLocaleString() }} km²</p>
    <p><strong>Région :</strong> {{ country.region }}</p>
    <div ref="globeContainer" style="width: 100%; height: 400px; margin-top: 20px;"></div>
  </div>
  <div v-else>
    <p>Chargement des données...</p>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import Globe from "globe.gl";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const country = ref(null);
    const globeContainer = ref(null);

    const languages = computed(() =>
      country.value?.languages
        ? Object.values(country.value.languages).join(", ")
        : "N/A"
    );

    const fetchCountry = async (countryName) => {
      try {
        const response = await axios.get(
          `https://restcountries.com/v3.1/name/${countryName}`
        );
        country.value = response.data[0];
        console.log("Country data loaded:", country.value);
      } catch (error) {
        console.error("Erreur lors du chargement des données : ", error);
      }
    };

    const initGlobe = () => {
      if (!country.value?.latlng) {
        console.error("Coordonnées non disponibles pour ce pays.");
        return;
      }
      console.log("Initializing globe with container:", globeContainer.value);
      const globe = Globe()(globeContainer.value)
        .globeImageUrl("//unpkg.com/three-globe/example/img/earth-day.jpg")
        .backgroundColor("#000000")
        .onGlobeClick((event) => {
          const { lat, lng } = event;
          console.log("Globe clicked at:", lat, lng);
          // Find the country based on lat/lng
          findCountryByLatLng(lat, lng);
        });

      // Centre le globe sur le pays
      globe.pointOfView({
        lat: country.value.latlng[0],
        lng: country.value.latlng[1],
        altitude: 2,
      });
    };

    const findCountryByLatLng = async (lat, lng) => {
      try {
        const response = await axios.get(
          `https://restcountries.com/v3.1/all`
        );
        const countries = response.data;
        console.log("response", response.data);

        // Log the clicked coordinates
        console.log("Clicked coordinates:", lat, lng);

        const clickedCountry = countries.find((c) => {
          const [countryLat, countryLng] = c.latlng;
          // Log the country coordinates
          console.log("Checking country:", c.name.common, countryLat, countryLng);
          return (
            Math.abs(countryLat - lat) < 2 && Math.abs(countryLng - lng) < 2
          );
        });

        console.log("Res : ", clickedCountry);

        if (clickedCountry) {
          // Update the URL and fetch the new country data
          router.push({ path: `/country/${clickedCountry.name.common}` });
          fetchCountry(clickedCountry.name.common);
        } else {
          console.error("No country found at the clicked coordinates.");
        }
      } catch (error) {
        console.error("Erreur lors de la recherche du pays : ", error);
      }
    };

    onMounted(() => {
      fetchCountry(route.params.name);
    });

    watch(route, (newRoute) => {
      if (newRoute.params.name !== country.value?.name.common) {
        fetchCountry(newRoute.params.name);
      }
    });

    watch(country, async (newCountry) => {
      if (newCountry) {
        await nextTick(); // Ensure the DOM is updated
        initGlobe();
      }
    });

    return {
      country,
      languages,
      globeContainer,
    };
  },
};
</script>