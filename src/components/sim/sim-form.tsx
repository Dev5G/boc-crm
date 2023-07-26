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
// import * as simsIconList from '@/components/icons/sim';
import { getIcon } from '@/utils/get-icon';
import { useRouter } from 'next/router';
import ValidationError from '@/components/ui/form-validation-error';
import { useEffect } from 'react';
import { Sim } from '@/types';
// import { simIcons } from './sim-icons';
import { useTranslation } from 'next-i18next';
import FileInput from '@/components/ui/file-input';
import SelectInput from '@/components/ui/select-input';
import { yupResolver } from '@hookform/resolvers/yup';
import { simValidationSchema } from './sim-validation-schema';
import {
  useSimQuery,
  useCreateSimMutation,
  useUpdateSimMutation,
} from '@/data/sim';
import { useTypesQuery } from '@/data/type';

import { BsLaptop } from 'react-icons/bs';

// export const updatedIcons = simIcons.map((item: any) => {
//   item.label = (
//     <div key={item.value} className="flex items-center space-s-5">
//       <span className="flex h-5 w-5 items-center justify-center">
//         {getIcon({
//           iconList: simsIconList,
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
//   const { sims, isLoading } = useSimsQuery({
//     slug: 'slug',
//   });
//   return (
//     <div>
//       <Label>{t('form:input-label-parent-sim')}</Label>
//       {/* <SelectInput
//         name="parent"
//         control={control}
//         getOptionLabel={(option: any) => option.name}
//         getOptionValue={(option: any) => option.id}
//         options={sims}
//         isClearable={true}
//         isLoading={loading}
//       /> */}
//     </div>
//   );
// }

type FormValues = {
  mdn: string;
  esn: string;
  imei: string;
  // simType: any;
};

const defaultValues = {
  mdn: '',
  esn: '',
  imei: '',
  // type: '',
};

type IProps = {
  initialValues?: Sim | undefined;
};
export default function CreateOrUpdateSimsForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  initialValues?.id;
  const isNewTranslation = router?.query?.action === 'translate';
  const {
    register,
    handleSubmit,
    control,
    setValue,
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
    resolver: yupResolver(simValidationSchema),
  });

  const { mutate: createSim, isLoading: creating } = useCreateSimMutation();
  const { mutate: updateSim, isLoading: updating } = useUpdateSimMutation();

  const onSubmit = async (values: FormValues) => {
    const input = {
      language: router.locale,
      mdn: values.mdn,
      esn: values.esn,
      imei: values.imei,

      // type_id: values.type?.id,
    };
    console.log(values);
    if (!initialValues) {
      console.log('🚀 ~ file: sim-form.tsx:140 ~ onSubmit ~ createSim');
      createSim({
        ...input,
      });
    } else {
      updateSim({
        ...input,
        id: initialValues.id!,
      });
      console.log('🚀 ~ file: sim-form.tsx:147 ~ onSubmit ~ updateSim');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:input-label-image')}
          details={t('form:sim-image-helper-text')}
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
          } ${t('form:sim-description-helper-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-esn')}
            {...register('esn')}
            error={t(errors.esn?.message!)}
            variant="outline"
            className="mb-5"
            onKeyDown={(e) => {
              if (
                e.code.toLowerCase() === 'enter' ||
                e.code.toLowerCase() === 'numpadenter'
              ) {
                console.log('Enter pressed');
                handleSubmit(onSubmit);
              }
            }}
            autoFocus
          />
          <Input
            label={t('form:input-label-mdn')}
            {...register('mdn')}
            error={t(errors.mdn?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-imei')}
            {...register('imei')}
            error={t(errors.imei?.message!)}
            variant="outline"
            className="mb-5"
          />

          {/* <TextArea
                label={t('form:input-label-details')}
                {...register('details')}
                variant="outline"
                className="mb-5"
              /> */}

          {/* <div className="mb-5">
            <Label>{t('form:input-label-select-sim-type')}</Label>
            <SelectInput
              name="simType"
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
            ? t('form:button-label-update-sim')
            : t('form:button-label-add-sim')}
        </Button>
      </div>
    </form>
  );
}
