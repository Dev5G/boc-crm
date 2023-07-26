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
// import * as usagesIconList from '@/components/icons/usage';
import { getIcon } from '@/utils/get-icon';
import { useRouter } from 'next/router';
import ValidationError from '@/components/ui/form-validation-error';
import { useEffect, useState } from 'react';
import { Usage } from '@/types';
// import { usageIcons } from './usage-icons';
import { useTranslation } from 'next-i18next';
import FileInput from '@/components/ui/file-input';
import SelectInput from '@/components/ui/select-input';
import { yupResolver } from '@hookform/resolvers/yup';
import { usageValidationSchema } from './usage-validation-schema';
import {
  useUsageQuery,
  useCreateUsageMutation,
  useUpdateUsageMutation,
} from '@/data/usage';
import { useTypesQuery } from '@/data/type';
import fs, { readFileSync } from 'fs';
import { BsLaptop } from 'react-icons/bs';
import { State, City, ICity } from 'country-state-city';
import { state_names } from '@/data/constant';
import { DatePicker } from '../ui/date-picker';

import { WorkBook, read, utils, readFile } from 'xlsx';
// export const updatedIcons = usageIcons.map((item: any) => {
//   item.label = (
//     <div key={item.value} className="flex items-center space-s-5">
//       <span className="flex h-5 w-5 items-center justify-center">
//         {getIcon({
//           iconList: usagesIconList,
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
//   const { usages, isLoading } = useUsagesQuery({
//     slug: 'slug',
//   });
//   return (
//     <div>
//       <Label>{t('form:input-label-parent-usage')}</Label>
//       {/* <SelectInput
//         name="parent"
//         control={control}
//         getOptionLabel={(option: any) => option.name}
//         getOptionValue={(option: any) => option.id}
//         options={usages}
//         isClearable={true}
//         isLoading={loading}
//       /> */}
//     </div>
//   );
// }

type FormValues = {
  file: File[];
  date: string;
};

const defaultValues = {
  file: [null],
  date: '',
};

type IProps = {
  initialValues?: Usage | undefined;
};

export default function CreateOrUpdateUsagesForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [excelData, setExcelData] = useState<any[][]>([]);
  const [date, setDate] = useState<string>(Date.now().toString());
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
    resolver: yupResolver(usageValidationSchema),
  });

  const { mutate: createUsage, isLoading: creating } = useCreateUsageMutation();
  const { mutate: updateUsage, isLoading: updating } = useUpdateUsageMutation();
  const onSubmit = async (values: FormValues) => {
    const input = {
      file: values.file[0],
      date,
    };
    console.log(input);
    if (!initialValues) {
      console.log('🚀 ~ file: usage-form.tsx:140 ~ onSubmit ~ createUsage');
      // createUsage({
      //   ...input,
      // });
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          const bstr = e.target.result;
          const wb = read(bstr, { type: 'binary' });
          const ws = wb.Sheets['Usage'];
          const jsonData = utils.sheet_to_json<any[]>(ws, { header: 1 });
          const tempData: any[] = [];
          jsonData.slice(1).forEach((row, index) => {
            tempData.push({
              device: { mdn: row[0] },
              planCode: row[1],
              planName: row[2],
              voiceMinutes: row[3],
              smsCount: row[4],
              dataMb: row[5],
            });
          });
          console.log(
            '🚀 ~ file: page.tsx:27 ~ useEffect ~ tempData:',
            tempData
          );
          createUsage({
            data: { ...tempData },
            count: jsonData.length -1,
            date,
          });
        }
      };
      reader.readAsBinaryString(input.file);
      // const d = read(input.file);
      // console.log('🚀 ~ file: usage-form.tsx:139 ~ onSubmit ~ d:', d);
      // updateWorkBook(d);
    } else {
      // updateUsage({
      //   ...input,
      //   id: initialValues.id!,
      // });
      console.log('🚀 ~ file: usage-form.tsx:147 ~ onSubmit ~ updateUsage');
    }
  };
  // const updateCities = (stateId: string) => {
  //   const s = City.getCitiesOfState('US', stateId).map((city) => ({
  //     label: city.name,
  //     value: city.name,
  //   }));
  //   console.log('🚀 ~ file: usage-form.tsx:223 ~ s ~ s:', s);
  //   setCities(s);
  // };

  // const updatedCities = cities.map((city) => {
  //   const item: { label: any; value: string } = { label: null, value: '' };
  //   item.label = (
  //     <div key={city.value} className="flex items-center space-s-5">
  //       {/* //       <span className="flex h-5 w-5 items-center justify-center">
  //   //         {getIcon({
  //             iconList: usagesIconList,
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
          details={t('form:usage-image-helper-text')}
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
          } ${t('form:usage-description-helper-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          {/* <FileInput name="file" control={control} multiple={false} /> */}
          <Input
            label={t('form:input-label-phone-number')}
            {...register('file')}
            error={t(errors.file?.message!)}
            type="file"
            variant="outline"
            className="mb-5"
          />
          <DatePicker
            value={date}
            onChange={(e) => {
              console.log({ e });
              if (!!e) setDate(e.toString());
            }}
          />
          {/* <Input
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
          /> */}
          {/* <Input
            label={t('form:input-label-address')}
            {...register('address')}
            error={t(errors.address?.message!)}
            variant="outline"
            className="mb-5"
          /> */}
          {/* <TextArea
            label={t('form:input-label-address')}
            {...register('address')}
            variant="outline"
            className="mb-5"
          /> */}
          {/* <SelectState control={control} setValue={setValue} /> */}
          {/* <SelectCity control={control} setValue={setValue} /> */}
          {/* <SelectState
            control={control}
            setValue={setValue}
          />
          <SelectCity control={control} setValue={setValue} state={state} /> */}

          {/* <Input
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
          /> */}
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
            <Label>{t('form:input-label-select-usage-type')}</Label>
            <SelectInput
              name="usageType"
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
            ? t('form:button-label-update-usage')
            : t('form:button-label-add-usage')}
        </Button>
      </div>
    </form>
  );
}
