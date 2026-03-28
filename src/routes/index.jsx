import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import Dashboard from '../pages/Dashboard';
import PageReplacementSimulator from '../simulators/pageReplacement/PageReplacementSimulator';
import PagingSimulator from '../simulators/paging/PagingSimulator';
import SegmentationSimulator from '../simulators/segmentation/SegmentationSimulator';
import VirtualMemorySimulator from '../simulators/virtualMemory/VirtualMemorySimulator';
import PartitioningSimulator from '../simulators/partitioning/PartitioningSimulator';
import ThrashingSimulator from '../simulators/thrashing/ThrashingSimulator';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'page-replacement',
        element: <PageReplacementSimulator />,
      },
      {
        path: 'paging',
        element: <PagingSimulator />,
      },
      {
        path: 'segmentation',
        element: <SegmentationSimulator />,
      },
      {
        path: 'virtual-memory',
        element: <VirtualMemorySimulator />,
      },
      {
        path: 'partitioning',
        element: <PartitioningSimulator />,
      },
      {
        path: 'thrashing',
        element: <ThrashingSimulator />,
      },
    ],
  },
]);
