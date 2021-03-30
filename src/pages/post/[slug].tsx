import { useEffect, useMemo, useRef } from 'react';

import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
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
  preview: boolean;
}

export default function Post({ post, preview }: PostProps): JSX.Element {
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

        <title>{post?.data?.title ?? 'SpaceTraveling'}</title>
      </Head>

      <Header />

      <div className={styles.container}>
        <img
          src={post?.data?.banner.url ?? '/images/banner.webp'}
          alt={post?.data?.author ?? 'Banner'}
        />

        <article className={commonStyles.container}>
          <header>
            <h1>
              {router.isFallback
                ? 'Carregando...'
                : post?.data?.title || 'Título'}
            </h1>
            <div className={commonStyles.postInfo}>
              <time>
                <FiCalendar />
                {post?.first_publication_date
                  ? format(
                      new Date(post?.first_publication_date),
                      'dd MMM yyyy',
                      {
                        locale: ptBR,
                      }
                    )
                  : 'Data de publicação'}
              </time>

              <span>
                <FiUser />
                {post?.data?.author ?? 'Autor'}
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

          {preview && (
            <aside>
              <Link href="/api/exit-preview">
                <a>Sair do modo Preview</a>
              </Link>
            </aside>
          )}
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

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = null,
  previewData = {},
}) => {
  const { slug } = params;

  const { ref } = previewData;

  const prismic = getPrismicClient();
  const response =
    preview && ref
      ? await prismic.getSingle('posts', { ref })
      : (await prismic.getByUID('posts', String(slug), {})) || null;

  if (!response) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

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
      preview,
    },
  };
};
