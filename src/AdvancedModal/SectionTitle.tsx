import { theme } from 'antd';
import React from 'react';

const SectionTitle: React.FC<{
  children?: React.ReactNode;
  title?: string;
}> = ({ children, title }) => {
  const { token } = theme.useToken();
  const style: React.CSSProperties = {
    borderLeft: `3px solid ${token.colorPrimary}`,
    fontSize: 16,
    fontWeight: 399,
    paddingLeft: 8,
    marginBottom: 13,
  };

  return <div style={style}>{children || title}</div>;
};

export default SectionTitle;
