import Input from '@/components/ui/input';
import {
  Control,
  FieldErrors,
  useForm,
  useFormState,
  useWatch,
} from 'react-hook-form';
import Button from '@/components/ui/button';
import TextArea from '@/components/ui/text-area';
import Label from '@/components/ui/label';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
// import * as customersIconList from '@/components/icons/customer';
import { getIcon } from '@/utils/get-icon';
import { useRouter } from 'next/router';
import ValidationError from '@/components/ui/form-validation-error';
import { useEffect, useState } from 'react';
import { Customer } from '@/types';
// import { customerIcons } from './customer-icons';
import { useTranslation } from 'next-i18next';
import FileInput from '@/components/ui/file-input';
import SelectInput from '@/components/ui/select-input';
import { yupResolver } from '@hookform/resolvers/yup';
import { customerValidationSchema } from './customer-validation-schema';
import {
  useCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
} from '@/data/customer';
import { useTypesQuery } from '@/data/type';

import { BsLaptop } from 'react-icons/bs';
import { State, City, ICity } from 'country-state-city';
import { state_names } from '@/data/constant';

// export const updatedIcons = customerIcons.map((item: any) => {
//   item.label = (
//     <div key={item.value} className="flex items-center space-s-5">
//       <span className="flex h-5 w-5 items-center justify-center">
//         {getIcon({
//           iconList: customersIconList,
//           iconName: item.value,
//           className: 'max-h-full max-w-full',
//         })}
//       </span>
//       <span>{item.label}</span>
//     </div>
//   );
//   return item;
// });

// function SelectCategories({
//   control,
//   setValue,
// }: {
//   control: Control<FormValues>;
//   setValue: any;
// }) {
//   const { locale } = useRouter();
//   const { t } = useTranslation();
//   const { customers, isLoading } = useCustomersQuery({
//     slug: 'slug',
//   });
//   return (
//     <div>
//       <Label>{t('form:input-label-parent-customer')}</Label>
//       {/* <SelectInput
//         name="parent"
//         control={control}
//         getOptionLabel={(option: any) => option.name}
//         getOptionValue={(option: any) => option.id}
//         options={customers}
//         isClearable={true}
//         isLoading={loading}
//       /> */}
//     </div>
//   );
// }
function SelectState({
  control,
  setValue,
}: {
  control: Control<FormValues>;
  setValue: any;
}) {
  const { t } = useTranslation();
  const states = State.getStatesOfCountry('US');
  const updatedStates = states.map((state) => {
    return { name: state.name, value: state.isoCode };
  });
  return (
    <div className="mb-5">
      <Label>{t('form:input-label-state')}</Label>
      <SelectInput
        name="state"
        control={control}
        getOptionLabel={(option: any) => {
          return option.name;
        }}
        getOptionValue={(option: any) => option.isoCode}
        options={updatedStates}
        isClearable={true}
        isLoading={false}
      />
    </div>
  );
}

function SelectCity({
  control,
  setValue,
  state,
}: {
  control: Control<FormValues>;
  setValue: any;
  state: string;
}) {
  const { t } = useTranslation();
  const [cities, setCities] = useState<ICity[]>([]);
  useEffect(() => {
    const cityList = City.getCitiesOfState('US', state);
    if (!!cityList) {
      setCities(cityList);
    }
  }, [state]);
  return (
    <div>
      <Label>{t('form:input-label-city')}</Label>
      <SelectInput
        name="city"
        control={control}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.name}
        options={cities}
        isClearable={true}
        isLoading={false}
      />
    </div>
  );
}
type FormValues = {
  name: string;
  email: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
};

const defaultValues = {
  name: '',
  email: '',
  phone_number: '',
  address: '',
  city: '',
  state: '',
  zip_code: '',
};

type IProps = {
  initialValues?: Customer | undefined;
};
export default function CreateOrUpdateCustomersForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [state, setState] = useState<string>('');
  const [cities, setCities] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);

  const isNewTranslation = router?.query?.action === 'translate';
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    // shouldUnregister: true,
    //@ts-ignore
    defaultValues: initialValues
      ? {
          ...initialValues,
          // ...(isNewTranslation && {
          //   type: null,
          // }),
        }
      : defaultValues,
    resolver: yupResolver(customerValidationSchema),
  });

  const { mutate: createCustomer, isLoading: creating } =
    useCreateCustomerMutation();
  const { mutate: updateCustomer, isLoading: updating } =
    useUpdateCustomerMutation();
  const onSubmit = async (values: FormValues) => {
    const input = {
      name: values.name,
      email: values.email,
      phone_number: values.phone_number,
      address: values.address,
      city: values.city,
      state: values.state,
      zip_code: values.zip_code,
    };
    console.log(values);
    if (!initialValues) {
      console.log(
        '🚀 ~ file: customer-form.tsx:140 ~ onSubmit ~ createCustomer'
      );
      createCustomer({
        ...input,
      });
    } else {
      updateCustomer({
        ...input,
        id: initialValues.id!,
      });
      console.log(
        '🚀 ~ file: customer-form.tsx:147 ~ onSubmit ~ updateCustomer'
      );
    }
  };

  // const updateCities = (stateId: string) => {
  //   const s = City.getCitiesOfState('US', stateId).map((city) => ({
  //     label: city.name,
  //     value: city.name,
  //   }));
  //   console.log('🚀 ~ file: customer-form.tsx:223 ~ s ~ s:', s);
  //   setCities(s);
  // };

  // const updatedCities = cities.map((city) => {
  //   const item: { label: any; value: string } = { label: null, value: '' };
  //   item.label = (
  //     <div key={city.value} className="flex items-center space-s-5">
  //       {/* //       <span className="flex h-5 w-5 items-center justify-center">
  //   //         {getIcon({
  //             iconList: customersIconList,
  //             iconName: item.value,
  //             className: 'max-h-full max-w-full',
  //           })}
  //         </span> */}
  //       <span>{city.label}</span>
  //     </div>
  //   );
  //   item.value = city.label;
  //   return item;
  // });

  // const updatedCites = update
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:input-label-image')}
          details={t('form:customer-image-helper-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput name="image" control={control} multiple={false} />
        </Card>
      </div> */}

      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:input-label-description')}
          details={`${
            initialValues
              ? t('form:item-description-edit')
              : t('form:item-description-add')
          } ${t('form:customer-description-helper-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-name')}
            {...register('name')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
            onKeyDown={(e) => {
              if (!!e && e.code) {
                console.log('Enter pressed', 'values: ', getValues());
                if (
                  e.code.toLowerCase() === 'enter' ||
                  e.code.toLowerCase() === 'numpadenter'
                )
                  handleSubmit(onSubmit);
              }
            }}
            autoFocus
          />
          <Input
            label={t('form:input-label-email')}
            {...register('email')}
            error={t(errors.email?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-phone-number')}
            {...register('phone_number')}
            error={t(errors.phone_number?.message!)}
            variant="outline"
            className="mb-5"
          />
          {/* <Input
            label={t('form:input-label-address')}
            {...register('address')}
            error={t(errors.address?.message!)}
            variant="outline"
            className="mb-5"
          /> */}
          <TextArea
            label={t('form:input-label-address')}
            {...register('address')}
            variant="outline"
            className="mb-5"
          />
          {/* <SelectState control={control} setValue={setValue} /> */}
          {/* <SelectCity control={control} setValue={setValue} /> */}
          {/* <SelectState
            control={control}
            setValue={setValue}
          />
          <SelectCity control={control} setValue={setValue} state={state} /> */}

          <Input
            label={t('form:input-label-city')}
            {...register('city')}
            error={t(errors.city?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-state')}
            {...register('state')}
            error={t(errors.city?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-zip-code')}
            {...register('zip_code')}
            error={t(errors.zip_code?.message!)}
            variant="outline"
            className="mb-5"
          />
          {/* <SelectCity
            control={control}
            setValue={setValue}
            value={() => getValues('state')}
          /> */}
          {/* <TextArea
                label={t('form:input-label-details')}
                {...register('details')}
                variant="outline"
                className="mb-5"
              /> */}
          {/* <div className="mb-5">
            <Label>{t('form:input-label-select-customer-type')}</Label>
            <SelectInput
              name="customerType"
              control={control}
              options={updatedIcons}
              isClearable={true}
            />
          </div>
          <SelectCategories control={control} setValue={setValue} /> */}
        </Card>
      </div>
      <div className="mb-4 text-end">
        {initialValues && (
          <Button
            variant="outline"
            onClick={router.back}
            className="me-4"
            type="button"
          >
            {t('form:button-label-back')}
          </Button>
        )}

        {/* <Button loading={creating || updating}> */}
        <Button>
          {initialValues
            ? t('form:button-label-update-customer')
            : t('form:button-label-add-customer')}
        </Button>
      </div>
    </form>
  );
}
