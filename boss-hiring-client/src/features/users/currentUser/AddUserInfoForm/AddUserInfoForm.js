import React, { useState, useEffect } from "react";
import {
  NavBar,
  Icon,
  InputItem,
  List,
  TextareaItem,
  Button,
  Grid,
  Toast,
  ActivityIndicator,
} from "antd-mobile";
import { useHistory } from "react-router-dom";
import {
  updateUser,
  selectLoadingStatus,
  selectCurrentUser,
} from "./../currentUserSlice";
import { useDispatch, useSelector } from "react-redux";
import "./addUserInfoForm.less";

function AddBossInfoForm() {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [avatarList, setAvatarList] = useState([]);

  const [avatar, setAvatar] = useState("");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [salary, setSalary] = useState("");
  const [info, setInfo] = useState("");

  const onTitleChange = (val) => setTitle(val);
  const onCompanyChange = (val) => setCompany(val);
  const onSalaryChange = (val) => setSalary(val);
  const onInfoChange = (val) => setInfo(val);

  const loadingStatus = useSelector(selectLoadingStatus);

  useEffect(() => {
    let list = [];
    for (let i = 1; i <= 20; i++) {
      list.push({
        icon: require(`./../../avatars/avatar${i}.png`), // cannot use import
      });
    }
    setAvatarList(list);
  }, []);

  const onLeftClick = () => {
    history.push("/");
  };

  const onAvatarClick = (el) => {
    setAvatar(el.icon);
  };

  const onSaveClick = async () => {
    const data = { avatar, title, company, salary, info };
    const resultAction = await dispatch(updateUser(data));
    if (updateUser.fulfilled.match(resultAction)) {
      // succeed
      history.push("/");
    } else {
      if (resultAction.payload) {
        Toast.fail(resultAction.payload.message, 1.5);
      } else {
        Toast.fail(resultAction.error.message, 1.5);
      }
    }
  };

  const header =
    user.type === "recruiter"
      ? "What kind of job are you offering"
      : "What kind of job are you seeking";

  const avatarHeader = !avatar ? (
    "Please choose your avatar"
  ) : (
    <div>
      <img src={avatar} alt="unavailable avatar"></img>
    </div>
  );

  const description =
    user.type === "recruiter" ? "Job Description" : "Self Introduction";
  const descriptionPlaceholder =
    user.type === "recruiter"
      ? "Please describe this job more"
      : "Please introduce yourself";

  const buttonText = user.type === "recruiter" ? "Post this job" : "Save";

  return (
    <div className="user-info-form">
      <List>
        <ActivityIndicator
          animating={loadingStatus === "pending"}
          toast={true}
        />
      </List>
      <NavBar
        mode="dark"
        icon={<Icon type="left" />}
        onLeftClick={onLeftClick}
        rightContent={[<Icon key="1" type="ellipsis" />]}
      >
        Boss Hiring
      </NavBar>

      <List renderHeader={() => avatarHeader}>
        <Grid
          itemStyle={{ height: "auto" }}
          data={avatarList}
          carouselMaxRow={2}
          isCarousel
          onClick={(el) => onAvatarClick(el)}
        />
      </List>
      <List renderHeader={() => header}>
        <InputItem
          placeholder="What is the job title "
          onChange={(val) => onTitleChange(val)}
        >
          Job Title
        </InputItem>
        {user.type === "recruiter" ? (
          <InputItem
            placeholder="What is your company name"
            onChange={(val) => onCompanyChange(val)}
          >
            Company
          </InputItem>
        ) : null}

        {user.type === "recruiter" ? (
          <InputItem
            type="money"
            labelNumber={8}
            clear
            placeholder="What is the salary a month"
            extra="$"
            onChange={(val) => onSalaryChange(val)}
          >
            Salary per month
          </InputItem>
        ) : null}
      </List>
      <List renderHeader={() => description}>
        <TextareaItem
          placeholder={descriptionPlaceholder}
          autoHeight
          onChange={(val) => onInfoChange(val)}
        />
      </List>
      <List>
        <Button type="primary" onClick={onSaveClick}>
          {buttonText}
        </Button>
      </List>
    </div>
  );
}

export default AddBossInfoForm;
