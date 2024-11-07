
import { render } from 'preact';

import '@/app/styles/index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { MainActivity } from '@/app/pages/MainActivity';

// --------------------------------------------------------

render(<MainActivity />, document.getElementById('app')!);


// --------------------------------------------------------
