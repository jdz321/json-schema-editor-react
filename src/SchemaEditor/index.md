# Foo

This is an example component.

```tsx
import SchemaEditor from 'json-schema-editor-react';
import SimpleTextEditor from 'json-schema-editor-react/SimpleTextEditor';
import { useState } from 'react';
import { Input } from 'antd'

export default () => {
  const [value, setValue] = useState({ type: 'object' });
  const setSchema = (e: string) => {
    try {
      setValue(JSON.parse(e))
    } catch (e) {}
  }
  return (
    <>
      <SchemaEditor value={value} onChange={setValue} />
      <SimpleTextEditor
        value={JSON.stringify(value, null, 2)}
        onChange={setSchema}
      />
    </>
  );
};
```
