import * as Yup from 'yup';

const email = Yup.string().email('Invalid email address').required('Required');

export default email;
