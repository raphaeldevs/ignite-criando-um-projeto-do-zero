import { useEffect, useMemo, useRef } from 'react';

import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

import Prismic from '@prismicio/client';

import { RichText } from 'prismic-dom';

import { getPrismicClient } from '../../services/prismic';

import Header from '../../components/Header';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  const commentsSection = useRef<HTMLDivElement>(null);

  const readTime = useMemo(() => {
    const HUMAN_READ_WORDS_PER_MINUTE = 200;

    const words = post?.data?.content?.reduce((contentWords, content) => {
      contentWords.push(...content.heading.split(' '));

      const sanitizedContent = RichText.asText(content.body)
        .replace(/[^\w|\s]/g, '')
        .split(' ');

      contentWords.push(...sanitizedContent);

      return contentWords;
    }, []);

    return Math.ceil(words?.length / HUMAN_READ_WORDS_PER_MINUTE);
  }, [post]);

  useEffect(() => {
    const utteranceScript = document.createElement('script');

    utteranceScript.src = 'https://utteranc.es/client.js';
    utteranceScript.crossOrigin = 'anonymous';
    utteranceScript.async = true;
    utteranceScript.setAttribute('repo', 'raphaeldevs/spacetraveling-comments');
    utteranceScript.setAttribute('issue-term', 'title');
    utteranceScript.setAttribute('theme', 'github-dark');

    commentsSection.current?.appendChild(utteranceScript);
  }, []);

  return (
    <>
      <Head>
        <meta name="description" content={post?.data?.subtitle} />

        <title>{router.isFallback ? 'Carregando...' : post?.data.title}</title>
      </Head>

      <Header />

      <div className={styles.container}>
        <img src={post?.data.banner.url} alt={post?.data.author} />

        <article className={commonStyles.container}>
          <header>
            <h1>{router.isFallback ? 'Carregando...' : post?.data.title}</h1>
            <div className={commonStyles.postInfo}>
              <time>
                <FiCalendar />
                {format(new Date(post?.first_publication_date), 'dd MMM yyyy', {
                  locale: ptBR,
                }) ?? 'Data de publicação'}
              </time>

              <span>
                <FiUser />
                {post?.data.author ?? 'Autor'}
              </span>

              <span>
                <FiClock /> {readTime ? `${readTime} min` : 'Tempo de leitura'}
              </span>
            </div>
          </header>

          <main>
            {post?.data?.content?.map(groupContent => (
              <div key={groupContent.heading}>
                <h2>{groupContent.heading}</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(groupContent.body),
                  }}
                />
              </div>
            ))}
          </main>

          <footer ref={commentsSection} />
        </article>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      pageSize: 2,
    }
  );

  const paths = posts.results.map(post => ({
    params: {
      slug: post.uid,
    },
  }));

  return {
    fallback: true,
    paths,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content,
    },
  };

  return {
    props: {
      post,
    },
  };
};
