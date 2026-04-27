import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const graves = await getCollection('graves', (g) => g.data.status === 'published');
  const sorted = graves.sort((a, b) =>
    new Date(b.data.death).getTime() - new Date(a.data.death).getTime()
  );

  return rss({
    title: 'Product Grave — Learn from the Dead',
    description: 'A pixel-art graveyard for dead tech products. Explore the stories, causes of death, and lessons from failed startups and killed products.',
    site: context.site,
    items: sorted.map((grave) => ({
      title: `${grave.data.name} (${grave.data.birth}–${grave.data.death})`,
      pubDate: new Date(grave.data.death + '-01'),
      description: grave.data.summary || grave.data.epitaph,
      link: `/grave/${grave.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
