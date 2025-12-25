import { Center, Loader } from '@mantine/core';

export default function LoadingState() {
  return (
    <Center style={{ height: '100vh' }}>
      <Loader size="xl" />
    </Center>
  );
}
