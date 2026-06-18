import React, { useState } from "react";
import PostCreate from "./PostCreate";
import PostList from "./PostList";

const App = () => {
    // tick increments only after successful create
    const [refreshTick, setRefreshTick] = useState(0);

    return (
        <div className="container">
            <h1>Create Post</h1>
            <PostCreate onSuccess={() => setRefreshTick((n) => n + 1)} />
            <hr />
            <h1>Posts</h1>
            <PostList refresh={refreshTick} />
        </div>
    );
};

export default App;
