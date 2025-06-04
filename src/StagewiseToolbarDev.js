import React from 'react'; // 添加此行以使 JSX 有效

// Only mount in development mode
if (process.env.NODE_ENV === 'close') {
    import('react-dom/client').then(({ createRoot }) => {
      import('@stagewise/toolbar-react').then(({ StagewiseToolbar }) => {
        const config = { plugins: [] };
        let el = document.getElementById('stagewise-toolbar-root');
        if (!el) {
          el = document.createElement('div');
          el.id = 'stagewise-toolbar-root';
          document.body.appendChild(el);
        }
        createRoot(el).render(<StagewiseToolbar config={config} />);
      });
    });
  }