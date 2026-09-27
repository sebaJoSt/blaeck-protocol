import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import { useAllDocsData } from '@docusaurus/plugin-content-docs/client';
import { libraryNames } from '@site/src/components/libraryNames';
import styles from './LibraryPage.module.css';

// A library's page, laid out like a category overview: a card per version.
export default function LibraryPage({ id }) {
  const versions = useAllDocsData()[id].versions;
  const main = (v) => v.docs.find((d) => d.id === v.mainDocId)?.path ?? v.path;
  return (
    <Layout title={libraryNames[id]}>
      <main className={clsx('container margin-vert--lg', styles.page)}>
        <header>
          <Heading as="h1" className={styles.title}>
            {libraryNames[id]}
          </Heading>
          <p>All versions of {libraryNames[id]}.</p>
        </header>
        <section className="row margin-top--lg">
          {versions.map((v) => (
            <article key={v.name} className="col col--6 margin-bottom--lg">
              <Link to={main(v)} className={clsx('card padding--lg', styles.card)}>
                <Heading as="h2" className={clsx('text--truncate', styles.cardTitle)}>
                  📄️ {v.label}
                </Heading>
              </Link>
            </article>
          ))}
        </section>
      </main>
    </Layout>
  );
}
