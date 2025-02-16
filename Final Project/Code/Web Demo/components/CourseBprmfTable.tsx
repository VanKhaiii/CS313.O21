import { Course } from "@/app/types";
import { useRouter } from "next/navigation";
import { renderFieldValue } from "@/utils/util-functions";
import { useContext, useEffect, useState } from "react";
import { PageContext } from "@/app/layout";

export default async function CourseBprmfTable() {
  const [courseBprmfList, setCourseBprmfList] = useState<Course[]>([]);

  const { userID, setUserID, userList } = useContext(PageContext);
  const { setCourseID } = useContext(PageContext);

  // Hàm xử lí event navigate sang course-info/{courseID}
  const router = useRouter();

  const handleNavigateToCourseInfo = (courseId: string) => {
    router.push(`/course-info/${courseId}`);
    setCourseID(courseId); // Lưu trữ courseID vào global context
  };

  useEffect(() => {
    // Hàm fetch list courses đề xuất bởi Bprmf cho người dùng có id là {user_id}
    const fetchBprmfCourses = async () => {
      if (userID) {
        const response = await fetch(
          `http://localhost:8000/user/id/${userID}/best_match_courses?model_type=bprmf`
        );
        const responseJson = await response.json();
        const result = responseJson[0];
        setCourseBprmfList(result);
      }
    };

    fetchBprmfCourses();
  }, []);

  return (
    <div className="max-h-56 overflow-y-scroll">
      <p>BPRMF recommended courses</p>
      <table className="table-auto w-full">
        <thead className="sticky top-0 bg-purple-600 text-white">
          <tr className="bg-purple-600 text-white">
            <th className="p-2 border-b-2 border-black-600">Name</th>
            <th className="p-2 border-b-2 border-black-600">Schools</th>
          </tr>
        </thead>
        <tbody>
          {courseBprmfList.map((course, index) => (
            <tr
              key={index}
              className={`${index % 2 === 0 ? "bg-gray-200" : "bg-white"} hover:bg-green-300`}
              onClick={() => handleNavigateToCourseInfo(course.id)}
            >
              <td className="px-4 py-2">{renderFieldValue(course.name)}</td>
              <td className="px-4 py-2">
                {renderFieldValue(course.schools.join(", "))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
