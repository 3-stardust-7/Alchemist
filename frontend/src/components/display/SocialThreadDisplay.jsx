import { FlaskIcon } from "../icons";
export default  function SocialThreadDisplay({ raw }) {
  const posts = parseSocialThread(raw);
  return (
    <div className="social-thread">
      {posts.map((post, i) => (
        <div key={i} className="tweet-card">
          <div className="tweet-avatar"><FlaskIcon /></div>
          <div className="tweet-body">
            <div className="tweet-handle">
              @thealchemist
              <span className="tweet-num">{i + 1}/{posts.length}</span>
            </div>
            <div className="tweet-text">{stripMd(post)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}