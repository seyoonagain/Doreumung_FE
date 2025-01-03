'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { nicknameChangeSchema, NicknameChangeSchema } from '../schema/nicknameSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import Select from '@/components/common/select/Select';
import Button from '@/components/common/buttons/Button';
import Input from '@/components/common/inputs/Input';
import { UserDataType } from '../types';

const UserDataForm = () => {
  const [userData, setUserData] = useState<UserDataType>({
    // 임시 데이터
    nickname: 'jjangs',
    password: 'qwer1234',
    age: 123,
    gender: 'male',
    birthday: new Date('1997-12-14'),
  });

  // 확인용
  useEffect(() => {
    console.log(userData);
  }, [userData]);

  const genderOptions: { value: 'female' | 'male' | 'none'; label: string }[] = [
    { value: 'female', label: '여성' },
    { value: 'male', label: '남성' },
    { value: 'none', label: '선택안함' },
  ];

  const [newGender, setNewGender] = useState(userData.gender); // 초기값 설정

  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewGender(event.target.value as 'female' | 'male' | 'none'); // 선택된 값 업데이트
  };

  const [newBirthday, setNewBirthday] = useState<Date | null>(null); // 새로운 생년월일 관리
  const [isUserDataChangeActive, setIsUserDataChangeActive] = useState<boolean>(false);

  const {
    register, // 연결하여 유효성 검사 진행
    formState: { errors },
    getValues,
    handleSubmit,
    reset,
  } = useForm<NicknameChangeSchema>({
    resolver: zodResolver(nicknameChangeSchema),
    mode: 'onBlur',
    defaultValues: {
      nickname: userData.nickname, // 초기값 설정
    },
  });

  const handleSave = (data: NicknameChangeSchema) => {
    // 모든 데이터를 한 번에 업데이트
    const updatedData: UserDataType = {
      ...userData,
      nickname: data.nickname, // 닉네임은 유효성 검사를 통과한 데이터로 업데이트
      gender: newGender, // 상태로 관리 중인 성별
      birthday: newBirthday || userData.birthday, // 상태로 관리 중인 생년월일
    };

    setUserData(updatedData);
    setIsUserDataChangeActive(false);

    // React Hook Form 필드 초기화
    reset({ nickname: updatedData.nickname });
  };

  const handleSaveWithoutNickname = () => {
    // 닉네임 변경 없이 다른 데이터만 업데이트
    const updatedData: UserDataType = {
      ...userData,
      gender: newGender,
      birthday: newBirthday || userData.birthday,
    };

    setUserData(updatedData);
    setIsUserDataChangeActive(false);
  };

  const divStyle = `flex flex-col gap-3`;

  return (
    <div className="flex flex-col justify-between px-7 py-5 w-96 h-96 rounded-2xl border border-black bg-fadedGreen">
      <div className={divStyle}>
        <p className="text-xl">닉네임</p>
        {isUserDataChangeActive ? (
          <Input
            id="nickname"
            variant="default"
            className="self-start w-80"
            placeholder={userData.nickname}
            {...register('nickname')}
          />
        ) : (
          <p className="text-darkerGray">{userData.nickname}</p>
        )}
        {isUserDataChangeActive && errors.nickname && (
          <p className="px-3 pb-3 text-xs text-red">{errors.nickname.message}</p>
        )}
      </div>
      <div className={divStyle}>
        <p className="text-xl">생년월일</p>
        {isUserDataChangeActive ? (
          <Select
            setSelectedDate={setNewBirthday}
            optional={false}
            defaultDate={userData.birthday}
          />
        ) : (
          <p className="text-darkerGray">{dayjs(userData.birthday).format('YYYY-MM-DD')}</p>
        )}
      </div>

      <div className={divStyle}>
        <p className="text-xl">성별</p>
        {isUserDataChangeActive ? (
          <div className="flex gap-7 px-3">
            {genderOptions.map(genderOption => {
              return (
                <label
                  key={genderOption.value}
                  className="flex items-center space-x-2 pb-5 accent-darkGray"
                >
                  <input
                    type="radio"
                    name="gender"
                    value={genderOption.value}
                    className="w-3"
                    onChange={handleGenderChange}
                    checked={newGender === genderOption.value} // 기본값 설정
                  />
                  <span className="h-4 text-sm text-darkGray align-middle">
                    {genderOption.label}
                  </span>
                </label>
              );
            })}
          </div>
        ) : (
          <p className="text-darkerGray">
            {userData.gender == 'male'
              ? '남성'
              : userData.gender == 'female'
              ? '여성'
              : '선택 안 함'}
          </p>
        )}
      </div>

      <div className="flex gap-2 self-end text-darkerGray">
        {isUserDataChangeActive ? (
          <Button
            label="취소"
            onClick={() => {
              setIsUserDataChangeActive(false); // 수정 취소
              reset({
                nickname: userData.nickname, // 초기값 원래대로
              });
            }}
            className="bg-lighterGray text-darkerGray"
          />
        ) : null}
        <Button
          label={isUserDataChangeActive ? '저장' : '변경'}
          onClick={() => {
            if (isUserDataChangeActive) {
              const newNickname = getValues('nickname');
              if (newNickname) {
                // 닉네임 변경 시
                handleSubmit(handleSave)();
              } else {
                // 닉네임 변경 없이 다른 데이터만 업데이트
                handleSaveWithoutNickname();
              }
            } else {
              setIsUserDataChangeActive(true);
            }
          }}
        />
      </div>
    </div>
  );
};

export default UserDataForm;
