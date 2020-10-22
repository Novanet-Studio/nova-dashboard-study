<template>
  <section>
    <Article :blok="story.content"/>
  </section>
</template>

<script>
import Article from '~/components/Article.vue'

export default {
  components: {
    Article
  },
  data() {
    return {
      story: { content: {} }
    }
  },
  mounted() {
    // Use the input event for instant update of content
    this.$storybridge.on('input', e => {
      if (e.story.id === this.story.id) {
        this.story.content = e.story.content
      }
    })

    // Use the bridge to listen events
    this.$storybridge.on(['published', 'change'], e => {
      // window.location.reload
      this.$nuxt.$router.go({
        path: this.$nuxt.$router.currentRoute,
        force: true,
      })
    })
  },

  asyncData(context) {
    // Load the JSON from the API
    let version = context.query._storyblok || context.isDec ? 'draft' : 'published'

    return context.app.$storyapi
      .get(`cdn/stories/articles/${context.params.slug}`, {
        version,
      })
      .then(res => res.data)
      .catch(err => {
        if (!err.response) {
          console.error(err)
          context.error({
            statusCode: 404,
            message: 'Failed to receive content from API'
          })
        } else {
          console.error(err.response.data)
          context.error({
            statusCode: err.response.status,
            message: err.response.data
          })
        }
      })
  }
}
</script>

<style>

</style>