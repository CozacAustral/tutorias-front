'use-client';

import CreatePassword from './CreatePassword';
import { tokenProps } from '../../interfaces/tokenProps.interface'

const page = ({ params }: tokenProps) => {
  return <CreatePassword params={params}/>
}

export default page;