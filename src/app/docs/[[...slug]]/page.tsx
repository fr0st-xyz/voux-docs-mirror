import { getPageImage, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getGithubLastEdit } from 'fumadocs-core/content/github';

const EDIT_REPO_OWNER = process.env.NEXT_PUBLIC_DOCS_GH_OWNER || 'QuintixLabs';
const EDIT_REPO_NAME = process.env.NEXT_PUBLIC_DOCS_GH_REPO || 'voux-docs';
const EDIT_REPO_BRANCH = process.env.NEXT_PUBLIC_DOCS_GH_BRANCH || 'master';
const EDIT_PATH_PREFIX = process.env.NEXT_PUBLIC_DOCS_GH_PATH_PREFIX || 'content/docs';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const editPath = `${EDIT_PATH_PREFIX}/${page.path}`;
  let lastUpdate: Date | undefined;
  try {
    const lastEdit = await getGithubLastEdit({
      owner: EDIT_REPO_OWNER,
      repo: EDIT_REPO_NAME,
      path: editPath,
      branch: EDIT_REPO_BRANCH,
    });
    if (lastEdit) {
      lastUpdate = lastEdit;
    }
  } catch (_) {
    lastUpdate = undefined;
  }

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      editOnGithub={{
        owner: EDIT_REPO_OWNER,
        repo: EDIT_REPO_NAME,
        sha: EDIT_REPO_BRANCH,
        path: editPath,
      }}
      lastUpdate={lastUpdate}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<'/docs/[[...slug]]'>,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
