// import { GetStaticProps } from 'next';

import { FiCalendar, FiUser } from 'react-icons/fi';

// import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

/* interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
} */

export default function Home(/* { postsPagination }: HomeProps */): JSX.Element {
  return (
    <div className={`${commonStyles.container} ${styles.container}`}>
      <img src="/logo.svg" alt="logo" />

      <ul className={styles.posts}>
        <li className={styles.post}>
          <a href="/">
            <h3>Como utilizar Hooks</h3>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>

            <div className={commonStyles.postInfo}>
              <time>
                <FiCalendar />
                15 Mar 2021
              </time>
              <span>
                <FiUser />
                Raphael Corrêa
              </span>
            </div>
          </a>
        </li>

        <li className={styles.post}>
          <a href="/">
            <h3>Criando um app CRA do zero</h3>
            <p>
              Tudo sobre como criar a sua aplicação utilizando Create React App
            </p>

            <div className={commonStyles.postInfo}>
              <time>
                <FiCalendar />
                19 Abr 2021
              </time>
              <span>
                <FiUser />
                Diego Marcelo
              </span>
            </div>
          </a>
        </li>

        <li className={styles.post}>
          <a href="/">
            <h3>Como utilizar Hooks</h3>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>

            <div className={commonStyles.postInfo}>
              <time>
                <FiCalendar />
                15 Mar 2021
              </time>
              <span>
                <FiUser />
                Raphael Corrêa
              </span>
            </div>
          </a>
        </li>

        <li className={styles.post}>
          <a href="/">
            <h3>Criando um app CRA do zero</h3>
            <p>
              Tudo sobre como criar a sua aplicação utilizando Create React App
            </p>

            <div className={commonStyles.postInfo}>
              <time>
                <FiCalendar />
                19 Abr 2021
              </time>
              <span>
                <FiUser />
                Diego Marcelo
              </span>
            </div>
          </a>
        </li>
      </ul>

      <button type="button">Carregar mais posts</button>
    </div>
  );
}

/* export const getStaticProps = async () => {
  // const prismic = getPrismicClient();
  // const postsResponse = await prismic.query(TODO);
  // TODO
}; */
