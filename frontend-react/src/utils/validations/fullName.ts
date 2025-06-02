import * as Yup from 'yup';

const fullName = Yup.string().max(100).required('Required');

export default fullName;
