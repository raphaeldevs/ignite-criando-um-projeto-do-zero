// import { GetStaticPaths, GetStaticProps } from 'next';

// import { getPrismicClient } from '../../services/prismic';

import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

import Header from '../../components/Header';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

/* interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
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
} */

export default function Post(): JSX.Element {
  return (
    <>
      <Header />

      <div className={styles.container}>
        <img src="/banner.png" alt="phone" />

        <article className={commonStyles.container}>
          <header>
            <h1>Criando um app CRA do zero</h1>
            <div className={commonStyles.postInfo}>
              <time>
                <FiCalendar />
                15 Mar 2021
              </time>

              <span>
                <FiUser />
                Raphael Corrêa
              </span>

              <span>
                <FiClock /> 4 min
              </span>
            </div>
          </header>

          <main>
            <h2>Proin et varius</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

            <p>
              Nullam dolor sapien, vulputate eu diam at, condimentum hendrerit
              tellus. <strong>Nam facilisis sodales</strong> felis, pharetra
              pharetra lectus auctor sed.
            </p>

            <p>
              Ut venenatis mauris vel libero pretium, et pretium ligula
              faucibus. Morbi nibh felis, elementum a posuere et, vulputate et
              erat. Nam venenatis.
            </p>

            <ul>
              <li>Lorem ipsum dolor sit amet consectetur adipisicing elit</li>
            </ul>

            <h2>Proin et varius</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

            <p>
              Nullam dolor sapien, vulputate eu diam at, condimentum hendrerit
              tellus. Nam facilisis sodales felis, pharetra pharetra lectus
              auctor sed.
            </p>

            <p>
              Ut venenatis mauris vel libero pretium, et pretium ligula
              faucibus. Morbi nibh felis, elementum a posuere et, vulputate et
              erat. Nam venenatis.
            </p>
          </main>
        </article>
      </div>
    </>
  );
}

/* export const getStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(TODO);

  // TODO
};

export const getStaticProps = async context => {
  const prismic = getPrismicClient();
  const response = await prismic.getByUID(TODO);

  // TODO
}; */
