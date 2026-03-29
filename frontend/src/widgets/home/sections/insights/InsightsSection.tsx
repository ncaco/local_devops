import Link from "next/link";
import { posts } from "@/src/entities";
import { Container, SectionHeading } from "@/src/shared/ui";

const blogContent = {
  heading: {
    label: "블로그",
    title: "전략, 디자인, 런칭 사이클에 대한 노트.",
    description: "고성장 제품과 함께한 경험을 팀이 짧게 정리했습니다.",
  },
  cta: "더 읽기 →",
};

export default function InsightsSection() {
  const insightsPosts = posts.slice(0, 2);
  const resolvedInsightsPosts = insightsPosts.length > 0 ? insightsPosts : posts;

  return (
    <section id="insights" className="bg-white">
      <Container>
        <div className="py-10">
          <SectionHeading
            label={blogContent.heading.label}
            title="인사이트"
            description={blogContent.heading.description}
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {resolvedInsightsPosts.map((post) => (
              <Link
                key={post.slug}
                href="/blog"
                className="rounded-3xl border border-slate-200 bg-white p-6 transition hover:border-slate-400"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {post.date}
                </p>
                <h3 className="mt-4 text-xl font-semibold">{post.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{post.summary}</p>
                <span className="mt-4 inline-block text-xs font-semibold text-primary">
                  {blogContent.cta}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
