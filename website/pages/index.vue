<template>
  <section>
    <component 
      v-if="story.content.component"
      :key="story.content._uid"
      :blok="story.content"
      :is="story.content.component"
    />
  </section>
</template>

<script>
export default {
  data() {
    return {story: { content: {} }}
  },
  mounted() {
    this.$storybridge.on('input', e => {
      if (e.story.id === this.story.id) {
        this.story.content = e.story.content
      }
    })

    this.$storybridge.on(['published', 'change'], e => {
      // window.location.reload()
      this.$nuxt.$router.go({
        path: this.$nuxt.$router.currentRoute,
        force: true,
      })
    })
  },
  asyncData (context) {
    // Load JSON from the API
    return context.app.$storyapi.get('cdn/stories/home', {
      version: 'draft'
    }).then((res) => {
      return res.data
    }).catch((err) => {
      if (!err.response) {
        console.error(err)
        context.error({
          statusCode: 404,
          message: 'Failed to receive content from API'
        })
      } else {
        console.error(res.response.data)
        context.error({
          statusCode: res.response.status,
          message: res.response.data
        })
      }
    })
  },
  async fetch(context) {
    // Loading reference data - Articles in our case
    if (context.store.state.articles.loaded !== '1') {
      let articlesRefRes = await context.app.$storyapi.get('cdn/stories/', {
        starts_width: 'articles/',
        version: 'draft'
      })

      context.store.commit('articles/setArticles', articlesRefRes.data.stories)
      context.store.commit('articles/setLoaded', '1')
    }
  }
}
</script>