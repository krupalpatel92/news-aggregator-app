import * as Yup from 'yup';

const termsCondition = Yup.boolean().oneOf([true], 'You must agree to the terms and conditions');

export default termsCondition;
