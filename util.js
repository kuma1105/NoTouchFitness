var util = {};

util.parseError = function (errors) {
  var parsed = {};
  // 에러 이름이 ValidationError인 경우
  if (errors.name == 'ValidationError') {
    for (var name in errors.errors) {
      var validationError = errors.errors[name];
      parsed[name] = { message: validationError.message };
    }
  }
  // 에러 코드가 11000 이고 에러 메시지에 username이 있을 경우
  else if (errors.code == '11000' && errors.errmsg.indexOf('username') > 0) {
    parsed.username = { message: '이미 존재하는 아이디입니다!' };
  }
  else {
    parsed.unhandled = JSON.stringify(errors);
  }
  return parsed;
}

// 사용자의 로그인 상태 파악
util.isLoggedin = function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  }
  else {
    req.flash('errors', { login: '로그인을 먼저 해주세요!' });
    res.redirect('/login');
  }
}

// 권한이 없음을 알려주며 로그아웃시킨다.
util.noPermission = function (req, res) {
  req.flash('errors', { login: "권한이 없습니다!" });
  req.logout();
  res.redirect('/login');
}

// ?
// 첫번째로 파라메터는 생성할 query string이 기존의 query string에 추가되는(appended) query인지 아닌지를 boolean으로 받습니다. 만약 추가되는 query라면 '&'로 시작하고, 아니라면 '?'로 시작하는 query string을 만듭니다.
// 두번째 파라메터는 req.query의 page나 limit을 overwrite하는 파라메터입니다. 예를들어 req.query.page의 값를 무시하고 page를 무조건 1로 하는 query를 만들고 싶다면 {page:1}을 전달하면 됩니다.
util.getPostQueryString = function (req, res, next) {
  res.locals.getPostQueryString = function (isAppended = false, overwrites = {}) {
    var queryString = '';
    var queryArray = [];
    var page = overwrites.page ? overwrites.page : (req.query.page ? req.query.page : '');
    var limit = overwrites.limit ? overwrites.limit : (req.query.limit ? req.query.limit : '');
    var searchType = overwrites.searchType ? overwrites.searchType : (req.query.searchType ? req.query.searchType : '');
    var searchText = overwrites.searchText ? overwrites.searchText : (req.query.searchText ? req.query.searchText : '');

    if (page) queryArray.push('page=' + page);
    if (limit) queryArray.push('limit=' + limit);
    if (searchType) queryArray.push('searchType=' + searchType);
    if (searchText) queryArray.push('searchText=' + searchText);

    if (queryArray.length > 0) queryString = (isAppended ? '&' : '?') + queryArray.join('&');

    return queryString;
  }
  next();
}

// DB에는 댓글들이 flat한 형태로 저장되어 있기 때문에 댓글들을 구조에 맞게 웹페이지에 표시하려면 먼저 tree 구조로 변환하는 코드가 필요하고, 두번째로 tree 구조를 render할 수 있는 view도 필요합니다.
// https://www.a-mean-blog.com/ko/blog/Node-JS-%EC%B2%AB%EA%B1%B8%EC%9D%8C/%EA%B2%8C%EC%8B%9C%ED%8C%90-%EB%A7%8C%EB%93%A4%EA%B8%B0-%EA%B3%A0%EA%B8%89/%EA%B2%8C%EC%8B%9C%ED%8C%90-%EB%8C%93%EA%B8%80-%EA%B8%B0%EB%8A%A5-%EB%A7%8C%EB%93%A4%EA%B8%B0-3-%EB%8C%80%EB%8C%93%EA%B8%80-%EA%B8%B0%EB%8A%A5
util.convertToTrees = function (array, idFieldName, parentIdFieldName, childrenFieldName) {
  var cloned = array.slice();

  for (var i = cloned.length - 1; i > -1; i--) {
    var parentId = cloned[i][parentIdFieldName];

    if (parentId) {
      var filtered = array.filter(function (elem) {
        return elem[idFieldName].toString() == parentId.toString();
      });

      if (filtered.length) {
        var parent = filtered[0];

        if (parent[childrenFieldName]) {
          parent[childrenFieldName].unshift(cloned[i]);
        }
        else {
          parent[childrenFieldName] = [cloned[i]];
        }

      }
      cloned.splice(i, 1);
    }
  }

  return cloned;
}

module.exports = util;