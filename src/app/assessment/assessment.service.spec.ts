import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RequestService } from '@shared/request/request.service';
import { BrowserStorageService } from '@services/storage.service';
import { UtilsService } from '@services/utils.service';
import { NotificationService } from '@shared/notification/notification.service';
import { AssessmentService } from './assessment.service';

fdescribe('AssessmentService', () => {
  let service: AssessmentService;
  let requestSpy: jasmine.SpyObj<RequestService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;
  let utils: UtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AssessmentService,
        UtilsService,
        {
          provide: NotificationService,
          useValue: jasmine.createSpyObj('NotificationService', ['modal'])
        },
        {
          provide: RequestService,
          useValue: jasmine.createSpyObj('RequestService', ['get', 'post', 'apiResponseFormatError'])
        },
        {
          provide: BrowserStorageService,
          useValue: jasmine.createSpyObj('BrowserStorageService', {
            getUser: {
              name: 'Test',
              projectId: 1
            }
          })
        },
      ]
    });
    service = TestBed.get(AssessmentService);
    requestSpy = TestBed.get(RequestService);
    notificationSpy = TestBed.get(NotificationService);
    utils = TestBed.get(UtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when testing getAssessment()', () => {
    let requestResponse;
    let expected;
    beforeEach(() => {
      requestResponse = {
        success: true,
        data: [
          {
            Assessment: {
              name: 'test',
              description: 'des',
              is_team: false,
              deadline: '2019-02-02'
            },
            AssessmentGroup: [
              {
                name: 'g name',
                description: 'g des',
                AssessmentGroupQuestion: [
                  {
                    AssessmentQuestion: {
                      id: 1,
                      name: 'test name 1',
                      description: 'des 1',
                      question_type: 'text',
                      is_required: true,
                      has_comment: true,
                      can_answer: true,
                      audience: ['submitter']
                    }
                  },
                  {
                    AssessmentQuestion: {
                      id: 2,
                      name: 'test name 2',
                      description: 'des 2',
                      question_type: 'oneof',
                      is_required: true,
                      has_comment: true,
                      can_answer: true,
                      audience: ['reviewer'],
                      AssessmentQuestionChoice: [
                        {
                          id: 21,
                          AssessmentChoice: {
                            name: 'choice name 1'
                          }
                        },
                        {
                          id: 22,
                          AssessmentChoice: {
                            name: 'choice name 2',
                            explanation: 'exp 2'
                          }
                        }
                      ]
                    }
                  },
                  {
                    AssessmentQuestion: {
                      id: 3,
                      name: 'test name 3',
                      description: 'des 3',
                      question_type: 'multiple',
                      is_required: true,
                      has_comment: true,
                      can_answer: true,
                      audience: ['submitter', 'reviewer'],
                      AssessmentQuestionChoice: [
                        {
                          id: 31,
                          AssessmentChoice: {
                            name: 'choice name 1',
                            description: 'choice des 1'
                          }
                        },
                        {
                          id: 32,
                          AssessmentChoice: {
                            name: 'choice name 2',
                            description: 'choice des 2'
                          }
                        }
                      ]
                    }
                  }
                ]
              },
              {
                name: 'g name',
                description: 'g des',
                AssessmentGroupQuestion: [
                  {
                    AssessmentQuestion: {
                      id: 11,
                      name: 'test name 11',
                      description: 'des 11',
                      question_type: 'file',
                      is_required: true,
                      has_comment: true,
                      can_answer: true,
                      audience: ['submitter', 'reviewer'],
                      file_type: {
                        type: 'any'
                      }
                    }
                  },
                  {
                    AssessmentQuestion: {
                      id: 12,
                      name: 'test name 12',
                      description: 'des 12',
                      question_type: 'team member selector',
                      is_required: true,
                      has_comment: true,
                      can_answer: true,
                      audience: ['submitter', 'reviewer'],
                      TeamMember: [
                        {
                          id: 121,
                          userName: 'member name 1'
                        },
                        {
                          id: 122,
                          userName: 'member name 2'
                        }
                      ]
                    }
                  },
                ]
              }
            ]
          }
        ]
      };
      const assessment = requestResponse.data[0];
      const group0 = assessment.AssessmentGroup[0];
      // text
      const question0 = group0.AssessmentGroupQuestion[0].AssessmentQuestion;
      // oneof
      const question1 = group0.AssessmentGroupQuestion[1].AssessmentQuestion;
      // multiple
      const question2 = group0.AssessmentGroupQuestion[2].AssessmentQuestion;
      const group1 = assessment.AssessmentGroup[1];
      // file
      const question3 = group1.AssessmentGroupQuestion[0].AssessmentQuestion;
      // team member selector
      const question4 = group1.AssessmentGroupQuestion[1].AssessmentQuestion;
      expected = {
        name: assessment.Assessment.name,
        description: assessment.Assessment.description,
        isForTeam: assessment.Assessment.is_team,
        dueDate: assessment.Assessment.deadline,
        isOverdue: assessment.Assessment.deadline ? utils.timeComparer(assessment.Assessment.deadline) < 0 : false,
        groups: [
          {
            name: group0.name,
            description: group0.description,
            questions: [
              {
                id: question0.id,
                name: question0.name,
                type: question0.question_type,
                description: question0.description,
                isRequired: question0.is_required,
                canComment: question0.has_comment,
                canAnswer: question0.can_answer,
                audience: question0.audience,
                submitterOnly: true,
                reviewerOnly: false
              },
              {
                id: question1.id,
                name: question1.name,
                type: question1.question_type,
                description: question1.description,
                isRequired: question1.is_required,
                canComment: question1.has_comment,
                canAnswer: question1.can_answer,
                audience: question1.audience,
                submitterOnly: false,
                reviewerOnly: true,
                info: '',
                choices: [
                  {
                    id: question1.AssessmentQuestionChoice[0].id,
                    name: question1.AssessmentQuestionChoice[0].AssessmentChoice.name,
                    explanation: ''
                  },
                  {
                    id: question1.AssessmentQuestionChoice[1].id,
                    name: question1.AssessmentQuestionChoice[1].AssessmentChoice.name,
                    explanation: question1.AssessmentQuestionChoice[1].AssessmentChoice.explanation
                  }
                ]
              },
              {
                id: question2.id,
                name: question2.name,
                type: question2.question_type,
                description: question2.description,
                isRequired: question2.is_required,
                canComment: question2.has_comment,
                canAnswer: question2.can_answer,
                audience: question2.audience,
                submitterOnly: false,
                reviewerOnly: false,
                info: `<h3>Choice Description:</h3><p>${question2.AssessmentQuestionChoice[0].AssessmentChoice.name} - ${question2.AssessmentQuestionChoice[0].AssessmentChoice.description}</p><p>${question2.AssessmentQuestionChoice[1].AssessmentChoice.name} - ${question2.AssessmentQuestionChoice[1].AssessmentChoice.description}</p>`,
                choices: [
                  {
                    id: question2.AssessmentQuestionChoice[0].id,
                    name: question2.AssessmentQuestionChoice[0].AssessmentChoice.name,
                    explanation: ''
                  },
                  {
                    id: question2.AssessmentQuestionChoice[1].id,
                    name: question2.AssessmentQuestionChoice[1].AssessmentChoice.name,
                    explanation: ''
                  }
                ]
              }
            ]
          },
          {
            name: group1.name,
            description: group1.description,
            questions: [
              {
                id: question3.id,
                name: question3.name,
                type: question3.question_type,
                description: question3.description,
                isRequired: question3.is_required,
                canComment: question3.has_comment,
                canAnswer: question3.can_answer,
                audience: question3.audience,
                submitterOnly: false,
                reviewerOnly: false,
                fileType: question3.file_type.type
              },
              {
                id: question4.id,
                name: question4.name,
                type: question4.question_type,
                description: question4.description,
                isRequired: question4.is_required,
                canComment: question4.has_comment,
                canAnswer: question4.can_answer,
                audience: question4.audience,
                submitterOnly: false,
                reviewerOnly: false,
                teamMembers: [
                  {
                    key: JSON.stringify(question4.TeamMember[0]),
                    userName: question4.TeamMember[0].userName
                  },
                  {
                    key: JSON.stringify(question4.TeamMember[1]),
                    userName: question4.TeamMember[1].userName
                  }
                ]
              }
            ]
          }
        ]
      };
    });

    it('should throw Assessment format error, if data format not match', () => {
      const tmpRes = JSON.parse(JSON.stringify(requestResponse));
      tmpRes.data = [];
      requestSpy.get.and.returnValue(of(tmpRes));
      service.getAssessment(1, 'assessment').subscribe();
      expect(requestSpy.apiResponseFormatError.calls.count()).toBe(1);
    });

    it('should throw Assessment.AssessmentGroup format error, if data format not match', () => {
      const tmpRes = JSON.parse(JSON.stringify(requestResponse));
      tmpRes.data[0].AssessmentGroup[0] = {};
      requestSpy.get.and.returnValue(of(tmpRes));
      service.getAssessment(1, 'assessment').subscribe();
      expect(requestSpy.apiResponseFormatError.calls.count()).toBe(1);
    });

    it('should throw Assessment.AssessmentGroupQuestion format error, if data format not match', () => {
      const tmpRes = JSON.parse(JSON.stringify(requestResponse));
      tmpRes.data[0].AssessmentGroup[0].AssessmentGroupQuestion[0] = {};
      requestSpy.get.and.returnValue(of(tmpRes));
      service.getAssessment(1, 'assessment').subscribe();
      expect(requestSpy.apiResponseFormatError.calls.count()).toBe(1);
    });

    it('should throw Assessment.AssessmentQuestion format error, if data format not match', () => {
      const tmpRes = JSON.parse(JSON.stringify(requestResponse));
      tmpRes.data[0].AssessmentGroup[0].AssessmentGroupQuestion[0].AssessmentQuestion = {};
      requestSpy.get.and.returnValue(of(tmpRes));
      service.getAssessment(1, 'assessment').subscribe();
      expect(requestSpy.apiResponseFormatError.calls.count()).toBe(1);
    });

    it('should throw Assessment.AssessmentQuestionChoice format error, if data format not match', () => {
      const tmpRes = JSON.parse(JSON.stringify(requestResponse));
      tmpRes.data[0].AssessmentGroup[0].AssessmentGroupQuestion[1].AssessmentQuestion.AssessmentQuestionChoice = {};
      requestSpy.get.and.returnValue(of(tmpRes));
      service.getAssessment(1, 'assessment').subscribe();
      expect(requestSpy.apiResponseFormatError.calls.count()).toBe(1);
    });

    it('should throw Assessment.AssessmentChoice format error, if data format not match', () => {
      const tmpRes = JSON.parse(JSON.stringify(requestResponse));
      tmpRes.data[0].AssessmentGroup[0].AssessmentGroupQuestion[1].AssessmentQuestion.AssessmentQuestionChoice[0] = {};
      requestSpy.get.and.returnValue(of(tmpRes));
      service.getAssessment(1, 'assessment').subscribe();
      expect(requestSpy.apiResponseFormatError.calls.count()).toBe(1);
    });

    it('should throw Assessment.AssessmentQuestion.file_type format error, if data format not match', () => {
      const tmpRes = JSON.parse(JSON.stringify(requestResponse));
      tmpRes.data[0].AssessmentGroup[1].AssessmentGroupQuestion[0].AssessmentQuestion.file_type = {};
      requestSpy.get.and.returnValue(of(tmpRes));
      service.getAssessment(1, 'assessment').subscribe();
      expect(requestSpy.apiResponseFormatError.calls.count()).toBe(1);
    });

    it('should throw Assessment.TeamMember #1 format error, if data format not match', () => {
      const tmpRes = JSON.parse(JSON.stringify(requestResponse));
      tmpRes.data[0].AssessmentGroup[1].AssessmentGroupQuestion[1].AssessmentQuestion.TeamMember = {};
      requestSpy.get.and.returnValue(of(tmpRes));
      service.getAssessment(1, 'assessment').subscribe();
      expect(requestSpy.apiResponseFormatError.calls.count()).toBe(1);
    });

    it('should throw Assessment.TeamMember #2 format error, if data format not match', () => {
      const tmpRes = JSON.parse(JSON.stringify(requestResponse));
      tmpRes.data[0].AssessmentGroup[1].AssessmentGroupQuestion[1].AssessmentQuestion.TeamMember[0] = {};
      requestSpy.get.and.returnValue(of(tmpRes));
      service.getAssessment(1, 'assessment').subscribe();
      expect(requestSpy.apiResponseFormatError.calls.count()).toBe(1);
    });

    it('should get correct assessment data', () => {
      requestSpy.get.and.returnValue(of(requestResponse));
      service.getAssessment(1, 'assessment').subscribe(
        assessment => expect(assessment).toEqual(expected)
      );
      expect(requestSpy.get.calls.count()).toBe(1);
    });

    it(`should not include a question group if there's no question inside` , () => {
      const tmpRes = JSON.parse(JSON.stringify(requestResponse));
      // if a question group doesn't have question
      tmpRes.data[0].AssessmentGroup[1].AssessmentGroupQuestion = [];
      const tmpExp = JSON.parse(JSON.stringify(expected));
      // the expected result won't contain that group
      tmpExp.groups.splice(1, 1);
      requestSpy.get.and.returnValue(of(tmpRes));
      service.getAssessment(1, 'assessment').subscribe(
        assessment => expect(assessment).toEqual(tmpExp)
      );
      expect(requestSpy.get.calls.count()).toBe(1);
    });
  });

  describe('when testing getAssessment()', () => {
    let requestResponse;
    let expected;
    beforeEach(() => {
      requestResponse = {}
    });
  });

});
